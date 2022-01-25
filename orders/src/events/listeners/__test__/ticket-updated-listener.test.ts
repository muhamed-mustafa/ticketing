import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@mootickets/common";

const setup = async () =>
{
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({ id : new mongoose.Types.ObjectId().toHexString() , title : "concert" , price : 20 });
    await ticket.save();

     // Create a fake data object
     const data : TicketUpdatedEvent['data'] =
     {
          id : ticket.id,
          title : "newConcert",
          price : 100,
          userId : "rando1242Id",
          version : ticket.version + 1
     };

     // Create a fake msg object
    // @ts-ignore
    const msg : Message =
    {
        ack : jest.fn(),
    };

    return { listener , ticket , data , msg };
};

it('finds, updates, and saves a ticket' , async () =>
{
    const { ticket , data , msg , listener } = await setup();

    await listener.onMessage(data , msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message' , async () =>
{
    const { data , listener , msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data , msg);

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number' ,  async () =>
{
    const { data , listener , msg } = await setup();

    data.version = 10;

    try
    { 
       await listener.onMessage(data , msg);
    }

    catch(e)
    {

    };

    expect(msg.ack).not.toHaveBeenCalled();
}); 