import request from 'supertest';
import { app } from '../../app';
import { Order , OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled' , async () =>
{
    const ticket = Ticket.build({
      id : new mongoose.Types.ObjectId().toHexString(),
      title : 'Concert',
      price : 200
    });

    await ticket.save();

    const user = global.signup();
    // make a request to build an order with this ticket
    const { body : order } = await request(app)
    .post('/api/orders')
    .set('Cookie' , user)
    .send({ ticketId : ticket.id })
    .expect(201);

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie' , user)
    .send()
    .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order created event' , async () =>
{
    const ticket = Ticket.build({
      id : new mongoose.Types.ObjectId().toHexString(),
      title : 'Concert',
      price : 200
    });

    await ticket.save();

    const user = global.signup();
    // make a request to build an order with this ticket
    const { body : order } = await request(app)
    .post('/api/orders')
    .set('Cookie' , user)
    .send({ ticketId : ticket.id })
    .expect(201);

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie' , user)
    .send()
    .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});