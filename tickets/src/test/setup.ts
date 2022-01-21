import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global
{
    function signup() : string[] 
    function MongooseId() : string;
}

global.MongooseId  = () =>
{
    return new mongoose.Types.ObjectId().toHexString();
}

let mongo : any;

jest.mock('../nats-wrapper.ts');

beforeAll(async () =>
{
    process.env.JWT_KEY = 'asdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as mongoose.ConnectOptions);
});

beforeEach(async () =>
{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections)
    {
        await collection.deleteMany({});
    }
});

afterAll(async() =>
{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = () =>
{
    // Build a JWT payload. => { id , email }
    const payload = { id : global.MongooseId() , email : "test@test.com"};

    // Createe The JWT!
    const token = jwt.sign(payload , process.env.JWT_KEY!);

    // Build session Object. => { jwt : My_JWT }
    const session = { jwt : token };

    // convert session to JSON
    const sessionObject = JSON.stringify(session);

    // Take JSON and encode it to base64
    const base64 = Buffer.from(sessionObject).toString('base64');

    // returns a string thats the cookie with the encoded data
    return [`session=${base64}`];
}
