import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import { errorHandler , NotFoundError , currentUser } from '@mootickets/common';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/newTicket';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

const app = express();
app.use(json());
app.set('trust proxy' , true);
app.use(cookieSession({ signed : false , secure : process.env.NODE_ENV !== 'test'}));

// Midlewares
app.use(currentUser);

// Routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*' , async () =>
{
    throw new NotFoundError();  
});

app.use(errorHandler);

export { app };