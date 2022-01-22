import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import { errorHandler , NotFoundError , currentUser } from '@mootickets/common';
import cookieSession from 'cookie-session';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';
import { createOrderRouter } from './routes/new';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.use(json());
app.set('trust proxy' , true);
app.use(cookieSession({ signed : false , secure : process.env.NODE_ENV !== 'test'}));

// Midlewares
app.use(currentUser);

// Routes
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.all('*' , async () =>
{
    throw new NotFoundError();  
});

app.use(errorHandler);

export { app };