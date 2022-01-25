import { Listener , OrderCreatedEvent , Subjects } from "@mootickets/common";
import { QueueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expiartionQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>
{
    subject : Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QueueGroupName;
    async onMessage(data : OrderCreatedEvent['data'] , msg : Message)
    {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`Wiating this many millseconds to process the job ${delay}`);

        await expiartionQueue.add({ orderId : data.id } , { delay });

        msg.ack();
    }
}