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
Object.defineProperty(exports, "__esModule", { value: true });
exports.correoExiste = void 0;
const usuario_1 = require("../models/usuario");
const correoExiste = (correo = "") => __awaiter(void 0, void 0, void 0, function* () {
    const correoExiste = yield usuario_1.Usuario.findOne({ where: { correo: correo } });
    if (correoExiste) {
        throw new Error(`el correo ${correo} ya esta registrado`);
    }
});
exports.correoExiste = correoExiste;
//SALA CHAT 
//# sourceMappingURL=db_validadores.js.map