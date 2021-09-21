"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const salaChat_1 = require("../controllers/salaChat");
const db_validar_1 = require("../middlewares/db-validar");
const validar_campo_1 = require("../middlewares/validar-campo");
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = express_1.Router();
//verificar una (1) sala con token
router.get('/:ids', [
    validar_JWT_1.validarJWT,
    db_validar_1.validarUsuarioID
], salaChat_1.verificarSalaChat);
//verificar todas las salas de una con token 
router.get('/lista/full', [
    validar_JWT_1.validarJWT,
], salaChat_1.mostrarListaDeChat);
//Crear sala de chat: requisitos *token 
router.post('/', [
    validar_JWT_1.validarJWT,
    db_validar_1.validarUsuarioID,
    express_validator_1.check('titulo', 'tiene que tener un titulo').not().isEmpty(),
    express_validator_1.check('tiempo', 'el tiempo es oblogatorio').not().isEmpty(),
    validar_campo_1.validarCampos
], salaChat_1.crearSala);
//VERIFICAR EL ID Y TOKEN POR LINK
router.get('/verficacion/sala/:id/:token', salaChat_1.verificarLink);
//VERIFICAR SI EL USUARIO CON EL TOKEN QUE TIENE ES VALIDO PARA ENTRAR A LA SALA
router.get('/verficacion/token', [
    validar_JWT_1.validarJWT,
], salaChat_1.entrarSalaToken);
//BUSCARDOR DE CONTACTOS
router.get('/buscar/:id', salaChat_1.buscador);
//ENTRAR A LA SALA SIN TOKEN CON EL LINK
router.post('/registro/notoken/:id', salaChat_1.entrarSalaSintoken);
//ENTRAR A SALA CON TOKEN CON LINK
router.put('/:id/idMio', [validar_JWT_1.validarJWT], salaChat_1.entrarSalaConID);
router.post('/mensaje/ulitmo/:id', salaChat_1.agregarUltimomsg);
//VERIFICAR LA SALA CON EL LINK DE AMIGOS
router.get('/verificar/uno/:id', salaChat_1.VerificarSalaUna);
//SOLO PRUEBAS
router.get('/verdad/perrona/:id', salaChat_1.VerificarSalaUna);
router.get('/verdad/perrona/gato/:id', salaChat_1.buscador);
exports.default = router;
//# sourceMappingURL=salaChat.js.map