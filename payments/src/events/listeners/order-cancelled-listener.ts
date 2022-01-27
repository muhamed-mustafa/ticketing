import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import {  Listener , OrderCancelledEvent , OrderStatus, Subjects } from "@mootickets/common";
import { QueueGroupName } from "./queue-qroup-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>
{
    subject : Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = QueueGroupName;
    async onMessage(data : OrderCancelledEvent['data'] , msg : Message)
    {
        const order = await Order.findOne({ _id : data.id , version : data.version - 1});
        if(!order)
        {
            throw new Error('Order Not Found!');
        }

        order.set({ status : OrderStatus.Cancelled });

        await order.save();

        msg.ack();
    }
}

