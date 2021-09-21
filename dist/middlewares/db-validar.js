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
exports.validarUsuarioID = void 0;
const usuario_1 = require("../models/usuario");
const validarUsuarioID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    if (id == 0 || id == '0') {
        return next();
    }
    const usuario = yield usuario_1.Usuario.findByPk(id.id);
    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.estado)) {
        return res.status(404).json({
            ok: false,
            msg: 'usuario no existe'
        });
    }
    next();
});
exports.validarUsuarioID = validarUsuarioID;
//# sourceMappingURL=db-validar.js.map