import dotenv from 'dotenv';
import ServerApp from './models/server';


dotenv.config();


const server = new ServerApp();
server.listen();
