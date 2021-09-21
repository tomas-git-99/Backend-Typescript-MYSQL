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
exports.VerificarSalaUna = exports.buscador = exports.agregarUltimomsg = exports.prueba = exports.entrarSalaSintoken = exports.entrarSalaToken = exports.verificarLink = exports.entrarSalaConID = exports.mostrarListaDeChat = exports.verificarSalaChat = exports.crearSala = void 0;
const sequelize_1 = require("sequelize");
const genera_jwt_1 = require("../helpers/genera-jwt");
const sala_chat_1 = require("../models/sala_chat");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_1 = require("../models/usuario");
const crearSala = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //datos mandados despues de hacer la validacion de JWT
        const { id: creado_por_ID } = req.params;
        const { titulo, tiempo } = req.body;
        const token = yield genera_jwt_1.generarJWTconSala(creado_por_ID, tiempo);
        const data = {
            creado_por_ID,
            titulo,
            tiempo,
            token,
        };
        const sala = new sala_chat_1.SalaChat(data);
        yield sala.save();
        res.json({
            ok: true,
            sala
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            error
        });
    }
});
exports.crearSala = crearSala;
//VERIFICAR SI EL CHAT SIGUE viva, CON JWT TOKEN, solo verifica uno
const verificarSalaChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  const sala:any = await SalaChat.sequelize?.query(`SELECT creado_por_ID,token, estado FROM sala_de_chat WHERE creado_por_ID=${id}`,{ type: QueryTypes.SELECT }); */
    try {
        //id de la SALA sacado del path, por el motivo que en los params viene el usuario
        const ids = req.path;
        const salaID = ids.split('/');
        // opcion de hacerlo con el query y los comandos de mysql
        const sala = yield sala_chat_1.SalaChat.findByPk(salaID[1]);
        /* const sala:any = await SalaChat.findAll({where:{ id:salaID[1], attribute: ['titulo', 'tiempo', 'token'] }}) */
        const token = verificarTokenExp((sala === null || sala === void 0 ? void 0 : sala.token) || '');
        if (!token) {
            if (sala === null || sala === void 0 ? void 0 : sala.estado) {
                sala.estado = false;
                yield sala.save();
                return res.json({
                    ok: false,
                    msg: "esta sala ya no existe"
                });
            }
            return res.json({
                ok: false,
                msg: "esta sala ya no existe"
            });
        }
        res.json({
            ok: true,
            sala
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            msg: 'hable con el administrador'
        });
    }
});
exports.verificarSalaChat = verificarSalaChat;
//verificar la lista de salas completas con el ID del usuario que lo pidio
const mostrarListaDeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //el ID sala del token ya antes  verificado
        const { id } = req.params;
        const sala = (yield sala_chat_1.SalaChat.findAll({ where: { [sequelize_1.Op.or]: [{ creado_por_ID: id }, { invitado_ID: id }], estado: true }, attributes: ['id', 'creado_por_ID', 'token', 'titulo', 'estado', 'invitado_ID', 'sala_completa', 'ultimo_msg', 'updatedAt'], order: [['updatedAt', 'DESC']] })) || Object;
        /*     const salas = await SalaChat.findByPk(id)  */
        //recorrer la salas para ver si los token son validos, caso contrario cambiar el estadp
        sala.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
            const token = verificarTokenExp(e.token);
            if (!token) {
                yield sala_chat_1.SalaChat.update({ estado: false }, { where: { id: e.id } });
                /*      e.estado = false;
                     await e.save(); */
            }
        }));
        res.json({
            ok: true,
            sala
        });
    }
    catch (error) {
        return res.status(404).json({
            ok: false,
            error
        });
    }
});
exports.mostrarListaDeChat = mostrarListaDeChat;
const entrarSalaConID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, idMio } = req.params; //ID sala y mio
    const sala = yield sala_chat_1.SalaChat.findByPk(id);
    yield sala.update({ invitado_ID: idMio, sala_completa: true });
    res.json({
        ok: true,
        sala
    });
});
exports.entrarSalaConID = entrarSalaConID;
//token y id  de  params para verificar la sala
const verificarLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        console.log(id);
        const tokenVerificacion = verificarTokenExp(token);
        if (!tokenVerificacion) {
            return res.json({
                ok: false,
                msg: 'Esta sala ya no existe'
            });
        }
        const sala = yield sala_chat_1.SalaChat.findByPk(id);
        if (!(sala === null || sala === void 0 ? void 0 : sala.estado)) {
            return res.json({
                ok: false,
                sg: "esta sala ya no existe"
            });
        }
        if ((sala === null || sala === void 0 ? void 0 : sala.sala_completa) == true) {
            return res.json({
                ok: false,
                sg: "esta sala ya no existe"
            });
        }
        res.json({
            ok: true,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.verificarLink = verificarLink;
// token en el headers
const entrarSalaToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = req.params;
    const idSala = req.header('sala');
    const usuario = yield usuario_1.Usuario.findByPk(usuarios.id);
    const sala = yield sala_chat_1.SalaChat.findByPk(idSala);
    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.estado)) {
        return res.status(500).json({
            ok: false,
            sg: "esta usuario no existe"
        });
    }
    if (usuario.id == (sala === null || sala === void 0 ? void 0 : sala.creado_por_ID)) {
        return res.status(404).json({
            ok: false,
            msg: 'No puedes entrar a tu misma sala'
        });
    }
    sala.estado = true;
    sala.invitado_ID = usuario.id;
    yield (sala === null || sala === void 0 ? void 0 : sala.save());
    res.json({
        ok: true,
        sala
    });
});
exports.entrarSalaToken = entrarSalaToken;
const entrarSalaSintoken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const { id } = req.params;
        const sala = yield sala_chat_1.SalaChat.findByPk(id);
        yield sala_chat_1.SalaChat.update({ nombre_sin_registro: nombre, sala_completa: true }, { where: { id: id } });
        const token = yield genera_jwt_1.generarJWT('0');
        res.json({
            ok: true,
            sala,
            token
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
});
exports.entrarSalaSintoken = entrarSalaSintoken;
const prueba = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* [Op.or]:[{invitado_ID:14}, {invitado_ID:0}] */
    /* { creado_por_ID:14 ,invitado_ID:{[Op.notIn]:[14,0 ]}, estado:true } */
    //const sala = await SalaChat.findAll({where:{[Op.or]:[{creado_por_ID:14}, {invitado_ID:14}], estado:true}, attributes:['id','creado_por_ID','token', 'titulo', 'estado','invitado_ID','sala_completa']}) || Object; 
    /* const salanew:any = await SalaChat.sequelize?.query(`SELECT * FROM sala_de_chat_view WHERE creado_por_ID=${14}`,{ type: QueryTypes.SELECT }); */
    /* const salanew:any = await SalaChat.findAll({where:{creado_por_ID:16}, order: [['updatedAt', 'DESC']]}) */
    /*     const nuevo:any = await SalaChat.findAll({where:{creado_por_ID:14, estado:false}, order: [['updatedAt', 'DESC']]})
     */ const nuevo = yield sala_chat_1.SalaChat.update({ estado: false }, { where: { creado_por_ID: 14 } });
    const nuevo2 = yield sala_chat_1.SalaChat.findAll({ where: { creado_por_ID: 14, estado: false }, order: [['updatedAt', 'DESC']] });
    /* nuevo.map( (e:any) => {
        e.estado = true;
        e.save()
    }) */
    res.json({
        nuevo2
    });
});
exports.prueba = prueba;
const agregarUltimomsg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const mensaje = req.body;
    console.log(mensaje.ultimo_msg);
    const sala = yield sala_chat_1.SalaChat.findByPk(id);
    sala.ultimo_msg = mensaje.ultimo_msg;
    yield sala.save();
    res.json({
        ok: true,
        sala,
    });
});
exports.agregarUltimomsg = agregarUltimomsg;
const buscador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const buscar = req.query;
    const salaChat = yield sala_chat_1.SalaChat.findAll({ where: { [sequelize_1.Op.or]: [{ creado_por_ID: id }, { invitado_ID: id }], estado: true, titulo: { [sequelize_1.Op.like]: '%' + buscar.titulo + '%' } }, attributes: ['titulo', 'updatedAt', 'ultimo_msg', 'tiempo', 'id'] });
    res.json({
        ok: true,
        salaChat
    });
});
exports.buscador = buscador;
const VerificarSalaUna = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const sala = yield sala_chat_1.SalaChat.findAll({ where: { id: id }, attributes: ['titulo', 'tiempo'] });
    console.log("gatoss");
    const [{ titulo, tiempo }] = sala;
    res.json({
        ok: true,
        titulo,
        tiempo
    });
});
exports.VerificarSalaUna = VerificarSalaUna;
const verificarTokenExp = (token) => {
    try {
        const tokenValidar = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || "");
        if (tokenValidar) {
            return true;
        }
    }
    catch (error) {
        return false;
    }
};
//# sourceMappingURL=salaChat.js.map