import { Router } from "express";
import { check } from "express-validator";
import { agregarUltimomsg, buscador, crearSala, entrarSalaConID, entrarSalaSintoken, entrarSalaToken, mostrarListaDeChat, prueba, verificarLink, verificarSalaChat, VerificarSalaUna} from "../controllers/salaChat";
import { validarUsuarioID } from "../middlewares/db-validar";
import { validarCampos } from "../middlewares/validar-campo";
import { validarJWT } from "../middlewares/validar-JWT";


const router = Router();


//verificar una (1) sala con token
router.get('/:ids', [
    validarJWT,
    validarUsuarioID
], verificarSalaChat);


//verificar todas las salas de una con token 
router.get('/lista/full',[
    validarJWT,
], mostrarListaDeChat );


//Crear sala de chat: requisitos *token 
router.post('/',[
    validarJWT,
    validarUsuarioID,
    check('titulo', 'tiene que tener un titulo').not().isEmpty(),
    check('tiempo', 'el tiempo es oblogatorio').not().isEmpty(),
    validarCampos
],  crearSala);


//VERIFICAR EL ID Y TOKEN POR LINK
router.get('/verficacion/sala/:id/:token', verificarLink)

//VERIFICAR SI EL USUARIO CON EL TOKEN QUE TIENE ES VALIDO PARA ENTRAR A LA SALA
router.get('/verficacion/token', [
    validarJWT,
],entrarSalaToken);

//BUSCARDOR DE CONTACTOS
router.get('/buscar/:id', buscador)

//ENTRAR A LA SALA SIN TOKEN CON EL LINK
router.post('/registro/notoken/:id', entrarSalaSintoken);

//ENTRAR A SALA CON TOKEN CON LINK
router.put('/:id/idMio',[validarJWT], entrarSalaConID)


router.post('/mensaje/ulitmo/:id', agregarUltimomsg);


//VERIFICAR LA SALA CON EL LINK DE AMIGOS
router.get('/verificar/uno/:id', VerificarSalaUna)





//SOLO PRUEBAS
router.get('/verdad/perrona/:id', VerificarSalaUna)

router.get('/verdad/perrona/gato/:id', buscador)


export default router;