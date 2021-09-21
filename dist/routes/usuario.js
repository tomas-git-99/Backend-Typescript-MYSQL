"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuario_1 = require("../controllers/usuario");
const db_validadores_1 = require("../helpers/db_validadores");
const validar_campo_1 = require("../middlewares/validar-campo");
const router = express_1.Router();
router.get('/', usuario_1.getUsuarios);
//crear nuevo usuario
router.post('/', [
    express_validator_1.check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    express_validator_1.check('password', 'El password es obligatorio').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
        returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10 }).withMessage('Error con el password'),
    express_validator_1.check('correo').custom(db_validadores_1.correoExiste),
    validar_campo_1.validarCampos
], usuario_1.postUsuario);
//actualizar usuario
router.put('/:id', [], usuario_1.putUsuario);
//eliminar usuario
router.delete('/:id', usuario_1.deleteUsuario);
//confirmar usuario y cambiar el estado a true pas
router.get('/confirmar', usuario_1.validarUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map