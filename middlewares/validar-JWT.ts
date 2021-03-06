import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Usuario } from "../models/usuario";

import dotenv from 'dotenv';
dotenv.config();

export const validarJWT = async( req:Request, res:Response, next:NextFunction ) => {

    const token = req.header('x-token');
    if ( !token ) {
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        })
    }
    
    try {
        
        const  usuarios:any = jwt.verify(token, process.env.SECRETORPRIVATEKEY || '');
        

        
        if(usuarios.id == 0 || usuarios.id == '0'){
            req.params = usuarios.id; 
            return next();
        }

        // leer el usuario que corresponde al uid
        const usuario:any = await Usuario.findByPk(usuarios.id)


        if (!usuario){
            return res.status(401).json({
                ok:false,
                msg:'token no valido - usuario no existe DB'
            })
        }

        // verificar si el uid tiene estado esta en true

        if ( !usuario.estado ){
            return res.status(401).json({
                ok:false,
                msg:'token no valido - estado false'
            })
        }
        /* console.log(usuario) */

        req.params = usuario; 

        next();
    } catch (error) {


        return res.status(401).json({
            ok:false,
            msg:'el token no es el correcto'
        })
        
    }


}