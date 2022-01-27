import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { Order } from "../../models/order";
import { OrderStatus } from "@mootickets/common";
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asldkfj',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user' , async () =>
{
    const order = Order.build({
      id : new mongoose.Types.ObjectId().toHexString(),
      price : 200,
      version : 0,
      userId : new mongoose.Types.ObjectId().toHexString(),
      status : OrderStatus.Created
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie' , global.signup())
    .send({
        token : "abc",
        orderId : order.id
    })
    .expect(401);
});


it('returns a 400 when purchasing a cancelled order' , async () =>
{ 
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id : new mongoose.Types.ObjectId().toHexString(),
      price : 200,
      version : 0,
      userId : userId,
      status : OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie' , global.signup(userId))
    .send({
        token : "abc",
        orderId : order.id
    })
    .expect(400);
});

it('returns a 201 with valid inputs' , async () =>
{
      const userId = global.MongooseId();
      const order = Order.build({
        id : new mongoose.Types.ObjectId().toHexString(),
        price : 100,
        version : 0,
        userId : userId,
        status : OrderStatus.Created
      });

      await order.save();

      await request(app)
      .post('/api/payments')
      .set('Cookie' , global.signup(userId))
      .send({
          token : "tok_visa",
          orderId : order.id
      })
      .expect(201);

    const chargeOptions = ( stripe.charges.create as jest.Mock ).mock.calls[0][0];
    console.log(chargeOptions);
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(100 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({ orderId : order.id  });
    expect(payment).not.toBeNull();
}); 
