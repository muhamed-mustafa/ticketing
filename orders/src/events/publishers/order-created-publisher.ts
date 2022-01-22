import { Subjects , OrderCreatedEvent , Publisher } from "@mootickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>
{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}