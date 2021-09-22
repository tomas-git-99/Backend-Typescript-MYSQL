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
exports.validarUsuario = exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuarios = void 0;
const usuario_1 = require("../models/usuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const genera_jwt_1 = require("../helpers/genera-jwt");
const enviar_email_1 = require("../helpers/enviar-email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//OBTENER USUARIOS:
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.Usuario.findAll({ where: { estado: true },
        attributes: [
            'id',
            'nombre',
            'correo',
            'estado'
        ]
    });
    res.json({
        usuario
    });
});
exports.getUsuarios = getUsuarios;
//CREAR NUEVO USUARIO   
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, nombre, correo, estado } = req.body;
        //encriptar password
        const salt = bcryptjs_1.default.genSaltSync();
        const newPassword = bcryptjs_1.default.hashSync(password, salt);
        const data = {
            nombre,
            correo,
            password: newPassword,
            estado
        };
        const usuarios = new usuario_1.Usuario(data);
        yield usuarios.save();
        const token = yield genera_jwt_1.generarJWTconSala(usuarios.id, 60);
        yield enviar_email_1.enviarMail(correo, token);
        res.json({
            ok: true,
            usuarios
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.postUsuario = postUsuario;
//ACTUALIZAR DATOS
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    try {
        const usuarios = yield usuario_1.Usuario.findByPk(id);
        if (!usuarios) {
            return res.status(404).json({
                ok: false,
                msg: `El usuario con el id ${id} no existe`
            });
        }
        if (!usuarios.estado) {
            return res.status(404).json({
                ok: false,
                msg: `El usuario no existe`
            });
        }
        yield usuarios.update(body);
        res.json({
            msg: 'putUsuario',
            usuarios,
        });
    }
    catch (error) {
    }
});
exports.putUsuario = putUsuario;
//ELIMINAR USUARIO
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuarios = yield usuario_1.Usuario.findByPk(id);
    if (!usuarios.estado) {
        return res.status(400).json({
            ok: false,
            msg: `El usuario ${usuarios.nombre} no existe en la base de datos`
        });
    }
    usuarios.estado = false;
    yield usuarios.save();
    res.json({
        ok: true,
        msg: `El usuario ${usuarios.nombre} fue eliminado con exito`
    });
});
exports.deleteUsuario = deleteUsuario;
//VALIDAR USUARIO CON TOKEN Y CAMBIAR SU ESTADO
const validarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('x-token') || '';
        const usuario = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || "");
        if (!usuario) {
            res.status(400).json({
                ok: false,
                msg: "el link ya no se puede usar"
            });
        }
        const usuarios = yield usuario_1.Usuario.findByPk(usuario.id);
        yield usuarios.update({ estado: true });
        res.json({
            ok: true,
            msg: 'el usuario se registro con exito'
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.validarUsuario = validarUsuario;
//# sourceMappingURL=usuario.js.map