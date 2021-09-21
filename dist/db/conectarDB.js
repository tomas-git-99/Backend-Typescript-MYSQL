"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* const db = new Sequelize('chat-sdestructivo', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});


 */
const db = new sequelize_1.Sequelize(process.env.CONFIGDATA || '', process.env.CONFIGUSER || '', process.env.CONFIGPASSWORD || '', {
    host: process.env.HOSTNAME,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        ssl: 'Amazon RDS'
    },
});
exports.default = db;
//# sourceMappingURL=conectarDB.js.map