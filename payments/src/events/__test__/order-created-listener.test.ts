import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCreatedListener } from '../listeners/order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@mootickets/common';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () =>
{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data : OrderCreatedEvent['data'] =
    {
        id : new mongoose.Types.ObjectId().toHexString(),
        version : 0,
        userId : "randomId",
        expiresAt : "asdfe",
        status : OrderStatus.Created,
        ticket :
        {
            id : new mongoose.Types.ObjectId().toHexString(),
            price : 200
        }
    };

    // @ts-ignore
    const msg : Message =
    {
        ack : jest.fn()
    }

    return { listener , msg , data };
};

it('eplicates the order info' , async () =>
{
    const { listener , data , msg } = await setup();

    await listener.onMessage(data , msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message' , async () =>
{
    const { listener , data , msg } = await setup();

    await listener.onMessage(data , msg);

    expect(msg.ack).toHaveBeenCalled();
});