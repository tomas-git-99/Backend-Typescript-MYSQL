import { Request, Response, Router } from "express";
import { authUsuario, verificarToken, verificarUsuario } from "../controllers/auth";
import { validarJWT } from "../middlewares/validar-JWT";

const router = Router();



//autenticar usuario, y devuelve el token
router.post('/', authUsuario);
router.get('/:id', verificarUsuario);

router.get('/token/verificar',[
    validarJWT
],verificarToken)

export default router;