"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWTsinRegistro = exports.generarJWTconSala = exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generarJWT = (id = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { id };
        const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY || '', {
            expiresIn: '4h'
        });
        if (!token) {
            throw new Error('No se pudo generar el token');
        }
        return token;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.generarJWT = generarJWT;
const generarJWTconSala = (id = '', tiempo) => __awaiter(void 0, void 0, void 0, function* () {
    let SumaMisegundos = tiempo * 60000;
    try {
        const payload = { id };
        const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY || '', {
            expiresIn: `${SumaMisegundos}`
        });
        if (!token) {
            throw new Error('No se pudo generar el token');
        }
        return token;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.generarJWTconSala = generarJWTconSala;
const generarJWTsinRegistro = (id = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { id };
        const token = yield jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEYSINREGISTRO || '', {
            expiresIn: '4h'
        });
        if (!token) {
            throw new Error('No se pudo generar el token');
        }
        return token;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.generarJWTsinRegistro = generarJWTsinRegistro;
//# sourceMappingURL=genera-jwt.js.map