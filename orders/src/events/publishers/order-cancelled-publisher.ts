import { Subjects , OrderCancelledEvent , Publisher } from "@mootickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>
{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}