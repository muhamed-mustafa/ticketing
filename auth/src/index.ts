import mongoose from 'mongoose';
import { app } from './app';

const start = async () =>
{
   if(!process.env.JWT_KEY)
   {
        throw new Error("JWT_KEY must be defined");
   }

   try
   {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth' , { useNewUrlParser : true , useUnifiedTopology : true , // useCreateIndex : true 
    } as mongoose.ConnectOptions);
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

