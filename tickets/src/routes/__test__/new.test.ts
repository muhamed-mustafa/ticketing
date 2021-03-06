import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests' , async () =>
{
    const response = await request(app).post('/api/tickets').send({});
    expect(response).not.toEqual(404);
});

it('can only accessed if user is signed in' , async () =>
{
    await request(app).post('/api/tickets').send({}).expect(401);
});

it('returs a status other than 401 if user is signed in' , async () =>
{
    const response = await request(app).post('/api/tickets').set('Cookie' , global.signup());
    expect(response).not.toEqual(401);
});

it('returns an error if an invalid title is provided' , async () =>
{
    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ title : '' , price : 10})
    .expect(400);

    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ price : 10})
    .expect(400);
});

it('returns an error if an invalid price is provided' , async () =>
{
    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ title : 'newTicket' , price : -10})
    .expect(400);

    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ title : 'newTicket' })
    .expect(400);
});

it('creates a ticket with invalid inputs' , async () =>
{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = "newTicket"
    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ title , price : 100}).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(100);
    expect(tickets[0].title).toEqual(title);
});

it('publishes an event' , async () =>
{
    const title = "newTicket"
    await request(app).post('/api/tickets').set('Cookie' , global.signup())
    .send({ title , price : 100}).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});