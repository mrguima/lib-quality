import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Logger from '../util/Logger';

class DBInit {
    private mongoServer?: MongoMemoryServer;

    public async start(): Promise<void> {
        Logger.debug('Starting inMemory MongoDB');
        this.mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(this.mongoServer.getUri(), {
            dbName: 'memoryDB',
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    public async stop(): Promise<void> {
        await mongoose.disconnect();
        await this.mongoServer?.stop();
    }
}

export default new DBInit();
