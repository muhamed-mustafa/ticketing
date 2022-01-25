import { Ticket } from "../ticket";

it('implements optimistic concurrency control' , async () =>
{
    const ticket = Ticket.build({
      title : "concert",
      price : 200,
      userId : "randomId"
    });

    // Save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate changes to the tickets we fetched
    firstInstance!.set({ price : 400 });
    secondInstance!.set({ price : 500 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try
    {
        await secondInstance!.save();
    }

    catch(e)
    {
        return;
    }

    throw new Error('Should not reach this point')
});

it('increments the version number on multiple saves' , async () =>
{
    const ticket = Ticket.build({
      title : "concert",
      price : 200,
      userId : "randomId"
    });

    // Save the ticket to the database
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});