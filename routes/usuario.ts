import { Router } from "express";
import { check } from "express-validator";
import { deleteUsuario, getUsuarios, postUsuario, putUsuario, validarUsuario } from "../controllers/usuario";
import { correoExiste } from "../helpers/db_validadores";
import { validarCampos } from "../middlewares/validar-campo";
import { validarJWT } from "../middlewares/validar-JWT";


const router = Router();

router.get('/', getUsuarios);

//crear nuevo usuario
router.post('/', [
    check('nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check('password', 'El password es obligatorio').isStrongPassword(
        { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, 
            returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, 
            pointsForContainingSymbol: 10}).withMessage('Error con el password'),    
    check('correo').custom(correoExiste),
    validarCampos
], postUsuario);

//actualizar usuario
router.put('/:id',[
],  putUsuario);

//eliminar usuario
router.delete('/:id', deleteUsuario);


//confirmar usuario y cambiar el estado a true pas

router.get('/confirmar', validarUsuario)

export default router;