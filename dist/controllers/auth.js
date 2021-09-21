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
exports.verificarToken = exports.verificarUsuario = exports.authUsuario = void 0;
const genera_jwt_1 = require("../helpers/genera-jwt");
const usuario_1 = require("../models/usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Autenticar nuevo usuario y JWT
const authUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password } = req.body;
    try {
        const usuario = yield usuario_1.Usuario.findOne({ where: { correo: correo } });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }
        const validPassword = bcryptjs_1.default.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                mdg: 'Usuario / Password no son correctos'
            });
        }
        const token = yield genera_jwt_1.generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'hable con el administrador'
        });
    }
});
exports.authUsuario = authUsuario;
//verificar si el usuario esta en la base de datos o fue eliminado
const verificarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let usuario = yield usuario_1.Usuario.findByPk(id);
    //verificar si el usuario esta en la base de datos
    if (!usuario) {
        return res.status(400).json({
            ok: false,
            msg: `El usuario no existe`
        });
    }
    //si el usuario fue eliminado
    if (!usuario.estado) {
        return res.status(400).json({
            ok: false,
            msg: `El usuario no existe`
        });
    }
    res.json({
        ok: true,
        usuario
    });
});
exports.verificarUsuario = verificarUsuario;
const verificarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            ok: true
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            msg: error
        });
    }
});
exports.verificarToken = verificarToken;
//# sourceMappingURL=auth.js.map