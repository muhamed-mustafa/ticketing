import { Subjects , Publisher , ExpirationCompleteEvent } from "@mootickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>
{
    subject : Subjects.ExpirationComplete = Subjects.ExpirationComplete;
};