import { Message } from "node-nats-streaming";
import { Listener , OrderCancelledEvent , Subjects } from "@mootickets/common";
import { QueueGroupName } from "./queue-group-name";
import { Ticket } from "../../src/models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>
{
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = QueueGroupName;
    async onMessage(data : OrderCancelledEvent['data'] , msg : Message)
    {
          const ticket = await Ticket.findById(data.ticket.id);

          if(!ticket)
          {
              throw new Error('Ticket not found');
          }

          ticket.set({ orderId : undefined });
          await ticket.save();

          await new TicketUpdatedPublisher(this.client).publish({
            id : ticket.id,
            title : ticket.title,
            price : ticket.price,
            userId : ticket.userId,
            orderId : ticket.orderId,
            version : ticket.version
          });

          msg.ack();
    }
};