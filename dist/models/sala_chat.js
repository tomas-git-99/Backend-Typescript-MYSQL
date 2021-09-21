"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaChat = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../db/conectarDB"));
class SalaChat extends sequelize_1.Model {
}
exports.SalaChat = SalaChat;
SalaChat.init({
    creado_por_ID: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING,
    },
    invitado_ID: {
        type: sequelize_1.DataTypes.NUMBER
    },
    tiempo: {
        type: sequelize_1.DataTypes.NUMBER
    },
    token: {
        type: sequelize_1.DataTypes.STRING //el momento que el chat se termina             
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN //si la sala sigue o no
    },
    sala_completa: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    total_msg: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    ultimo_msg: {
        type: sequelize_1.DataTypes.STRING,
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_sin_registro: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    freezeTableName: true,
    sequelize: conectarDB_1.default,
    tableName: "sala_de_chat"
});
//# sourceMappingURL=sala_chat.js.map