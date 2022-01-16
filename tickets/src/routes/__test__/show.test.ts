import { app } from "../../app";
import request from 'supertest';

it('returns a 404 if the ticket is not found' , async () =>
{
    const id = global.MongooseId();
    await request(app).get(`/api/tickets/${id}`)
    .send({})
    .expect(404);
});

it('returns the ticket if the ticket is found' , async () =>
{
    const response = await request(app).post('/api/tickets')
    .set('Cookie' , global.signup())
    .send({ title : 'concert' , price : 10})
    .expect(201);

    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

    expect(ticketResponse.body.title).toEqual('concert');
    expect(ticketResponse.body.price).toEqual(10);
});