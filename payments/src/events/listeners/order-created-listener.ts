import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { Listener , OrderCreatedEvent , Subjects } from "@mootickets/common";
import { QueueGroupName } from "./queue-qroup-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>
{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QueueGroupName;
    async onMessage(data : OrderCreatedEvent['data'] , msg : Message)
    {
        const order = Order.build({
            id : data.id,
            status : data.status,
            userId : data.userId,
            version : data.version,
            price : data.ticket.price
        });

        await order.save();

        msg.ack();
    }
}