import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

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

   if(!process.env.NATS_URL)
   {
        throw new Error("NATS_URL must be defined");
   }

   if(!process.env.NATS_CLIENT_ID)
   {
        throw new Error("NATS_CLIENT_ID must be defined");
   }

   if(!process.env.NATS_CLUSTER_ID)
   {
        throw new Error("NATS_CLUSTER_ID must be defined");
   }

   try
   {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID , process.env.NATS_CLIENT_ID , process.env.NATS_URL);
        natsWrapper.client.on('close' , () =>
        {
          console.log('Nats Connection Closed!');
          process.exit();
       }); 
     
        process.on('SIGINT' , () => natsWrapper.client.close());
        process.on('SIGTERM' , () => natsWrapper.client.close());

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

