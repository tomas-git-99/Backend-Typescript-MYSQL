import {Sequelize} from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();




/* const db = new Sequelize('chat-destructivo', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});
 */



const db = new Sequelize(process.env.CONFIGDATA || '', process.env.CONFIGUSER || '', process.env.CONFIGPASSWORD || '', {
    host: process.env.HOSTNAME,
    port:3306,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    //logging: false,
});


export default db;