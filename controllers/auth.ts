import { Request, Response } from "express";
import { generarJWT } from "../helpers/genera-jwt";
import { Usuario, TodoAtributos } from "../models/usuario";
import bcryptjs from 'bcryptjs'
import sequelize, { Sequelize } from "sequelize/types/lib/sequelize";
import { Model } from "sequelize/types";




//Autenticar nuevo usuario y JWT
 export const authUsuario = async(req:Request, res:Response) => {
    
    const {correo, password} = req.body;
    
    try {
        const usuario:any = await Usuario.findOne({where: {correo:correo}});

        if(!usuario){
            return res.status(400).json ({
                msg:'Usuario / Password no son correctos'
            })
        }
        if ( !usuario.estado ) {
            return res.status(400).json ({
                msg:'Usuario / Password no son correctos'
            })
        }

        const validPassword = bcryptjs.compareSync( password, usuario.password)

        if (!validPassword) {
            return res.status(400).json ( {
                mdg:'Usuario / Password no son correctos'
            });
        }

      
        const token =  await generarJWT( usuario.id );

        res.json({
            ok:true,
            usuario,
            token
        })


    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'hable con el administrador'
        });
    }
    
}



//verificar si el usuario esta en la base de datos o fue eliminado
export const verificarUsuario = async(req:Request, res:Response) => {

    const { id } = req.params;
    
    let usuario = await Usuario.findByPk(id); 

    //verificar si el usuario esta en la base de datos
    if (!usuario){
        return res.status(400).json ( {
            ok: false,
            msg:`El usuario no existe`
        })
    }
    //si el usuario fue eliminado
    if (!usuario.estado){
        return res.status(400).json ( {
            ok: false,
            msg:`El usuario no existe`
        })
    }

    res.json({
        ok:true,
        usuario
    })


}

export const verificarToken = async(req:Request, res:Response) => {

    try {
        res.json({
            ok:true
        })
    } catch (error) {
     res.status(400).json({
         ok: false,
         msg:error
     })   
    }
}

