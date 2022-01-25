import { Message } from "node-nats-streaming";
import mongoose from 'mongoose';
import { Ticket } from "../../../src/models/ticket";
import { OrderCancelledEvent } from '@mootickets/common';
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from '../../../src/nats-wrapper';

const setup = async() =>
{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({ title : "concert" , price : 200 , userId : "randomId"});
    ticket.set({ orderId });
    await ticket.save();

    const data : OrderCancelledEvent['data'] =
    {
        id : orderId,
        version : 0,
        ticket :
        {
            id : ticket.id
        }
    };

    // @ts-ignore
    const msg : Message =
    {
        ack : jest.fn()
    }

    return { listener , msg , data , ticket };
}

it('updates the ticket, publishes an event, and acks the message' , async () =>
{
    const { listener , msg , data , ticket } = await setup();

    await listener.onMessage(data , msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});