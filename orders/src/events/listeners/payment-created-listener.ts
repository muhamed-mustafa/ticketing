import { Subjects , Listener , PaymentCreatedEvent , OrderStatus } from '@mootickets/common';
import { Order } from '../../models/order';
import { QueueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>
{
    subject : Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = QueueGroupName;
    async onMessage(data : PaymentCreatedEvent['data'] , msg : Message)
    {
        const order = await Order.findById(data.orderId);
        if(!order)
        {
            throw new Error('Order Not Found!');
        }

        order.set({ status : OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
};