import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledListener } from '../listeners/order-cancelled-listener'; 
import { OrderCancelledEvent, OrderStatus } from '@mootickets/common';
import { natsWrapper } from '../../nats-wrapper';

const setup = async () =>
{
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
      id : new mongoose.Types.ObjectId().toHexString(),
      userId : "randomId",
      price : 200,
      version : 0,
      status : OrderStatus.Created
    });

    await order.save();
    
    const data : OrderCancelledEvent['data'] =
    {
        id : order.id,
        version : 1,
        ticket :
        {
            id : "abcd"
        }
    };

    // @ts-ignore
    const msg : Message =
    {
        ack : jest.fn()
    }

    return { listener , msg , data , order };
};

it('updates the status of the order' , async () =>
{
    const { listener , data , msg , order } = await setup();

    await listener.onMessage(data , msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message' , async () =>
{
    const { listener , data , msg } = await setup();

    await listener.onMessage(data , msg);

    expect(msg.ack).toHaveBeenCalled();
});
