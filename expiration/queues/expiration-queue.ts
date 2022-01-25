import Queue from "bull";
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../src/nats-wrapper';

interface payload
{
    orderId : string;
};

const expiartionQueue = new Queue<payload>("order:expiration" , {
  redis : 
  {
      host : process.env.REDIS_HOST
  },
});

expiartionQueue.process(async (job) =>
{
    new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId : job.data.orderId
    });
});

export { expiartionQueue };