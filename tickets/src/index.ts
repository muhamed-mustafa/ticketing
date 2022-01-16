import mongoose from 'mongoose';
import { app } from './app';

const start = async () =>
{
   if(!process.env.JWT_KEY)
   {
        throw new Error("JWT_KEY must be defined");
   }

   if(!process.env.MONGO_URI)
   {
        throw new Error("MONGO_URI must be defined");
   }

   try
   {
        await mongoose.connect(process.env.MONGO_URI , { useNewUrlParser : true , useUnifiedTopology : true , // useCreateIndex : true 
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

