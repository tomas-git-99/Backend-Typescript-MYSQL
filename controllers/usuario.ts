import { Request, Response } from "express";
import { validator, where } from "sequelize/types";
import { Usuario, TodoAtributos } from "../models/usuario";
import bcryptjs from 'bcryptjs'
import { generarJWTconSala } from "../helpers/genera-jwt";
import { enviarMail } from "../helpers/enviar-email";
import jwt from 'jsonwebtoken';


//OBTENER USUARIOS:
 export const getUsuarios = async (req:Request, res:Response) => {

    const usuario = await Usuario.findAll(
        { where: {estado:true},
            attributes: [
                'id',
                'nombre',
                'correo',
                'estado'
            ]
        }
        ); 
    
     res.json({
        usuario
     });
 }


//CREAR NUEVO USUARIO   
export const postUsuario = async (req:Request, res:Response) => {

    try {
        const { password, nombre, correo, estado} = req.body;

        //encriptar password
        const salt = bcryptjs.genSaltSync();
        const newPassword = bcryptjs.hashSync( password, salt );


        const data:any = {
            nombre,
            correo,
            password: newPassword,
            estado
        }

        const usuarios:any = new Usuario(data);

        await usuarios.save();

        const token = await generarJWTconSala(usuarios.id, 60)

        await enviarMail(correo, token); 
        
        res.json({
            ok: true,
            usuarios
        })
        
    } catch (error) {
        res.status(500).json(
            {
                ok: false,
                msg: error
            }
        )
    }


}

//ACTUALIZAR DATOS
export const putUsuario = async (req:Request, res:Response) => {

    const { id } = req.params;
    const { body } = req;


    try {
        const usuarios:any = await Usuario.findByPk(id);
    
        if (!usuarios){
            return res.status(404).json({
                ok: false,
                msg:`El usuario con el id ${ id } no existe`
            }
            );
        }

        if (!usuarios.estado){
            return res.status(404).json({
                ok: false,
                msg:`El usuario no existe`

            });
        }

        await usuarios.update(body);
        
    
    
        res.json({
            msg: 'putUsuario',
            usuarios,
        })
        
    } catch (error) {
        
    }
}

//ELIMINAR USUARIO
export const deleteUsuario = async(req:Request, res:Response) => {

    const { id } = req.params;


    const usuarios:any = await Usuario.findByPk(id);

    if (!usuarios.estado){
        return res.status(400).json({ 
            ok: false,
            msg:`El usuario ${usuarios.nombre} no existe en la base de datos`
        })
    }

    usuarios.estado = false;

    await usuarios.save();

    res.json({
        ok: true,
        msg: `El usuario ${usuarios.nombre} fue eliminado con exito`
    })
}



//VALIDAR USUARIO CON TOKEN Y CAMBIAR SU ESTADO

export const validarUsuario = async(req:Request, res:Response) => {

    try {

        const token:string = req.header('x-token') || '';

        const usuario:any = jwt.verify(token, process.env.SECRETORPRIVATEKEY || "")

        if (!usuario){
            res.status(400).json({ 
                ok: false,
                msg: "el link ya no se puede usar"
            })
            
        }
        const usuarios:any = await Usuario.findByPk(usuario.id);
        

    
        await usuarios.update({estado:true});
    
        res.json({ 
            ok: true,
            msg: 'el usuario se registro con exito'
        })
    } catch (error) {
        res.status(500).json({ 
            ok: false,
            msg: error
        })
    }

}
