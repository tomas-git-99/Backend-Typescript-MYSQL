"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validar_JWT_1 = require("../middlewares/validar-JWT");
const router = express_1.Router();
//autenticar usuario, y devuelve el token
router.post('/', auth_1.authUsuario);
router.get('/:id', auth_1.verificarUsuario);
router.get('/token/verificar', [
    validar_JWT_1.validarJWT
], auth_1.verificarToken);
exports.default = router;
//# sourceMappingURL=auth.js.map