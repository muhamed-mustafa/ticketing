import { Message } from "node-nats-streaming";
import { OrderCreatedEvent , Listener , Subjects } from "@mootickets/common";
import { QueueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>
{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QueueGroupName;

    async onMessage(data : OrderCreatedEvent['data'] , msg : Message)
    {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket)
        {
            throw new Error('Ticket Not Found!');
        }

        ticket.set({ orderId : data.id });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
          id : ticket.id,
          orderId : ticket.orderId,
          userId : ticket.userId,
          version : ticket.version,
          title : ticket.title,
          price : ticket.price
        });

        msg.ack();
    }
};