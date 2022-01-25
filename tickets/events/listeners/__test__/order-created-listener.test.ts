import { Message } from "node-nats-streaming";
import { Ticket } from "../../../src/models/ticket";
import { OrderCreatedEvent , OrderStatus } from "@mootickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../src/nats-wrapper";
import mongoose from 'mongoose';

const setup = async () =>
{
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
      title : "concert",
      price : 200,
      userId : "random1221Id"
    });

    await ticket.save();

    const data : OrderCreatedEvent['data'] =
    {
        id : new mongoose.Types.ObjectId().toHexString(),
        status : OrderStatus.Complete,
        version : 0,
        userId : "random1221Id",
        expiresAt : "asdf",
        ticket :
        {
            id : ticket.id,
            price : ticket.price
        },
    };

    // @ts-ignore
    const msg : Message =
    {
        ack : jest.fn()
    }

    return { listener , msg , data , ticket };
};

it('sets the userId of the ticket' , async () =>
{
    const { listener , ticket , data , msg } = await setup();

    await listener.onMessage(data , msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);
});

it('acks the message' , async () =>
{
    const { listener , data , msg } = await setup();

    await listener.onMessage(data , msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event' , async () =>
{
    const { listener , data , msg } = await setup();

    await listener.onMessage(data , msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse(( natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(updatedTicket.orderId).toEqual(data.id);
});
