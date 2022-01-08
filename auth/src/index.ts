import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signinRouter);
app.use(signoutRouter);

// Midlewares
app.use(errorHandler);

const PORT = 3000 || process.env.PORT;
app.listen(PORT , () => console.log(`Server Listening On Port ${PORT}`));