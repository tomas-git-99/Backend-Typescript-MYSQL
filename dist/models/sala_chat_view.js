"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaChatVIEW = void 0;
const sequelize_1 = require("sequelize");
const conectarDB_1 = __importDefault(require("../db/conectarDB"));
class SalaChatVIEW extends sequelize_1.Model {
}
exports.SalaChatVIEW = SalaChatVIEW;
SalaChatVIEW.init({
    creado_por_ID: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING,
    },
    invitado_ID: {
        type: sequelize_1.DataTypes.NUMBER
    },
    token: {
        type: sequelize_1.DataTypes.STRING //el momento que el chat se termina             
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN //si la sala sigue o no
    },
    ultimo_msg: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    sequelize: conectarDB_1.default,
    tableName: "sala_de_chat"
});
//# sourceMappingURL=sala_chat_view.js.map