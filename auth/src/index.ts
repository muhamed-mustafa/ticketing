import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from '../errors/not-found-error';
import mongoose from 'mongoose';

const app = express();
app.use(json());

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

const start = async () =>
{
   try
   {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connection to Mongodb Successfully!');
   }

   catch(e)
   {
       console.log(e);
   }

   const PORT = 3000 || process.env.PORT;
   app.listen(PORT , () => console.log(`Server Listening On Port ${PORT}`));
}

start();

