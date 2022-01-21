import { Publisher , Subjects , TicketCreatedEvent } from "@mootickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>
{
    subject : Subjects.TicketCreated = Subjects.TicketCreated;
}