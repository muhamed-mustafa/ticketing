import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler , NotFoundError } from '@mootickets/common';
import cookieSession from 'cookie-session';

const app = express();
app.use(json());
app.set('trust proxy' , true);
app.use(cookieSession({ signed : false , secure : process.env.NODE_ENV !== 'test'}));

// Routes
app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signinRouter);
app.use(signoutRouter);

// Midlewares
app.all('*' , async () =>
{
    throw new NotFoundError();  
});

app.use(errorHandler);

export { app };