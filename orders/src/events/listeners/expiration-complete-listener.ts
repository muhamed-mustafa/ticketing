import { Message } from "node-nats-streaming";
import { Order , OrderStatus } from "../../models/order";
import { Listener , Subjects , ExpirationCompleteEvent } from "@mootickets/common";
import { QueueGroupName } from "./queue-group-name";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>
{
    subject : Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = QueueGroupName;
    async onMessage(data : ExpirationCompleteEvent['data'] , msg : Message)
    {
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order)
        {
            throw new Error('Order Not Found!');
        }

        if(order.status === OrderStatus.Complete)
        {
            return msg.ack();
        }

        order.set({ status : OrderStatus.Cancelled });
        await order.save();
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id : order.id,
            version : order.version,
            ticket :
            {
                id : order.ticket.id
            }
        });

        msg.ack();
    }
};