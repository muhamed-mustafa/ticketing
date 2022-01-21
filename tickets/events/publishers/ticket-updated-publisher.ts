import { Publisher , Subjects , TicketUpdatedEvent } from "@mootickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>
{
    subject : Subjects.TicketUpdated = Subjects.TicketUpdated;
}