import { NextFunction, Request, Response } from "express";
import { Usuario } from "../models/usuario";



 export const validarUsuarioID = async(req:Request, res:Response, next:NextFunction) =>{


    const id:any = req.params;

    if(id == 0 || id == '0'){
        return next();
    }

    const usuario = await Usuario.findByPk(id.id);

    if(!usuario?.estado){
        return res.status(404).json({
            ok: false,
            msg:'usuario no existe'
        });
    }

    next();
 }