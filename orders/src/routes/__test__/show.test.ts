import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order' , async () =>
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
    
   // make request to fetch the order
   const { body : fetchedOrder } = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie' , user)
      .send()
      .expect(200);

   expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order' , async () =>
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
    
  // make request to fetch the order
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie' , global.signup())
      .send()
      .expect(401);
}); 
