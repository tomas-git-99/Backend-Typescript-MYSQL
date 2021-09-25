import { query, Request, Response } from "express";
import { Op, QueryTypes } from 'sequelize';
import { generarJWT, generarJWTconSala, generarJWTsinRegistro } from "../helpers/genera-jwt";
import { SalaChat,Salainfo } from "../models/sala_chat";
import jwt from 'jsonwebtoken';
import { Model } from "sequelize/types";
import sequelize, { or, Sequelize } from "sequelize/types/lib/sequelize";
import { TodoAtributos, Usuario } from "../models/usuario";



 export const crearSala = async(req:Request, res:Response) => {

    try {
        
        //datos mandados despues de hacer la validacion de JWT
        const  { id:creado_por_ID } = req.params;
    
        const { titulo, tiempo } = req.body;


    
        const token = await generarJWTconSala(creado_por_ID, tiempo);  
    
        const data:any = {
            creado_por_ID,
            titulo,
            tiempo,
            token,
        }

        const sala = new SalaChat( data )
    
         await sala.save()

        
        res.json({
            ok:true,
            sala
        })


    } catch (error) {
        res.status(404).json({
            ok:false,
            error
        })
    }
     

}


//VERIFICAR SI EL CHAT SIGUE viva, CON JWT TOKEN, solo verifica uno
export const verificarSalaChat = async (req:Request, res:Response) =>{
    /*  const sala:any = await SalaChat.sequelize?.query(`SELECT creado_por_ID,token, estado FROM sala_de_chat WHERE creado_por_ID=${id}`,{ type: QueryTypes.SELECT }); */


    try {
        
        //id de la SALA sacado del path, por el motivo que en los params viene el usuario
        const ids  = req.path;
       
        const salaID = ids.split('/');
        // opcion de hacerlo con el query y los comandos de mysql


        const sala   = await SalaChat.findByPk(salaID[1]);
        
        
 
        /* const sala:any = await SalaChat.findAll({where:{ id:salaID[1], attribute: ['titulo', 'tiempo', 'token'] }}) */
        
        const token = verificarTokenExp(sala?.token || '');
        

         if( !token ) {

             if (sala?.estado){
                 sala!.estado = false ;
                 await sala!.save();
                 return res.json({
                     ok:false,
                     msg:"esta sala ya no existe"
                 })
             }
             return res.json({
                ok:false,
                msg:"esta sala ya no existe"
            })

             }



       

 
        res.json({
            ok:true,
            sala
        })

    } catch (error) {
        res.status(404).json({
            ok:false,
            msg:'hable con el administrador'
        })
    }
    

}

//verificar la lista de salas completas con el ID del usuario que lo pidio
export const mostrarListaDeChat = async (req:Request, res:Response) => {

    try {

        //el ID sala del token ya antes  verificado
        const { id } = req.params;
        const sala = await SalaChat.findAll({where:{[Op.or]:[{creado_por_ID:id}, {invitado_ID:id}], estado:true}, attributes:['id','creado_por_ID','token', 'titulo', 'estado','invitado_ID','sala_completa', 'ultimo_msg', 'updatedAt'], order: [['updatedAt', 'DESC']]}) || Object; 

    /*     const salas = await SalaChat.findByPk(id)  */
        //recorrer la salas para ver si los token son validos, caso contrario cambiar el estadp


         sala.forEach(async(e:any) => {
            const token = verificarTokenExp(e.token)

            if(!token){
                await SalaChat.update({ estado:false },{ where: {id:e.id}} )
           /*      e.estado = false;
                await e.save(); */
            }
            })


       
        res.json({
            ok:true,
            sala

        })
            
    } 
    catch(error){
        return res.status(404).json({            
            ok:false,
            error
        })
    }
}

export const entrarSalaConID = async (req:Request, res:Response) => {

    const { id, idMio } = req.params; //ID sala y mio


    const sala:any = await SalaChat.findByPk(id);

    await sala.update({invitado_ID:idMio, sala_completa:true})

    res.json({
        ok:true,
        sala
    })
}



//token y id  de  params para verificar la sala
export const verificarLink = async (req:Request, res:Response) => {

    try {
        
        const { id ,token } = req.params;

        console.log(id)

        const tokenVerificacion = verificarTokenExp(token);
    
        if(!tokenVerificacion){
            return res.json({
                ok:false,
                msg:'Esta sala ya no existe'
            })
        }
    
        const sala = await SalaChat.findByPk(id);
    
        if(!sala?.estado){
            return res.json({
                ok:false,
                sg:"esta sala ya no existe"
            })
        }
        if(sala?.sala_completa == true){
            return res.json({
                ok:false,
                sg:"esta sala ya no existe"
            })
        }
    
        res.json({
            ok:true,        
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:error
        })
    }



}

// token en el headers
export const entrarSalaToken = async (req:Request, res:Response) => {


    const usuarios = req.params;

    const idSala = req.header('sala');

   

    const usuario:any = await Usuario.findByPk(usuarios.id);

    const sala = await SalaChat.findByPk(idSala) ;

    if(!usuario?.estado){
        return res.status(500).json({
            ok:false,
            sg:"esta usuario no existe"
        })
    }


    if (usuario.id == sala?.creado_por_ID){
        return res.status(404).json({
            ok:false,
            msg:'No puedes entrar a tu misma sala'
        })
    }

    sala!.estado = true;

    sala!.invitado_ID = usuario.id;

    await sala?.save();

    res.json({
        ok:true,
        sala
    })


}

export const entrarSalaSintoken = async (req:Request, res:Response) => {

    try {

        const { nombre } = req.body;
    
        const { id } = req.params;

        const sala = await SalaChat.findByPk(id);
        
        await SalaChat.update({ nombre_sin_registro:nombre, sala_completa:true },{ where: {id:id}} );

        const token = await generarJWT('0')
    
    
        res.json({
            ok:true,
            sala,
            token
        })
        
    } catch (error) {
        res.status(500).json({ 
            ok:false,
            msg: error
        })
    }

}


export const prueba =  async (req:Request, res:Response) => {

    /* [Op.or]:[{invitado_ID:14}, {invitado_ID:0}] */
    /* { creado_por_ID:14 ,invitado_ID:{[Op.notIn]:[14,0 ]}, estado:true } */
    //const sala = await SalaChat.findAll({where:{[Op.or]:[{creado_por_ID:14}, {invitado_ID:14}], estado:true}, attributes:['id','creado_por_ID','token', 'titulo', 'estado','invitado_ID','sala_completa']}) || Object; 

    /* const salanew:any = await SalaChat.sequelize?.query(`SELECT * FROM sala_de_chat_view WHERE creado_por_ID=${14}`,{ type: QueryTypes.SELECT }); */
    /* const salanew:any = await SalaChat.findAll({where:{creado_por_ID:16}, order: [['updatedAt', 'DESC']]}) */



/*     const nuevo:any = await SalaChat.findAll({where:{creado_por_ID:14, estado:false}, order: [['updatedAt', 'DESC']]})
 */    const nuevo = await SalaChat.update({ estado:false },{ where: {creado_por_ID:14}} )

       const nuevo2:any = await SalaChat.findAll({where:{creado_por_ID:14, estado:false}, order: [['updatedAt', 'DESC']]})
   

    /* nuevo.map( (e:any) => {
        e.estado = true;
        e.save()
    }) */

    res.json({
        nuevo2
     })
}

export const agregarUltimomsg = async (req:Request, res:Response) => {

    const { id } = req.params;
    
    
    const mensaje = req.body;

    console.log(mensaje.ultimo_msg)

    const sala:any = await SalaChat.findByPk(id);

    
    sala.ultimo_msg = mensaje.ultimo_msg

    await sala.save();

    res.json({ 
        ok: true,
        sala,
    })
    
}


export const buscador = async (req:Request, res:Response) => {

    const { id } = req.params;

    const buscar = req.query;

    const salaChat = await SalaChat.findAll({where: {[Op.or]:[{creado_por_ID:id}, {invitado_ID:id}], estado:true ,titulo:{[Op.like]: '%' + buscar.titulo + '%'}}, attributes:['titulo','updatedAt','ultimo_msg', 'tiempo','id']});

    res.json({
        ok:true,
        salaChat
    })

}

export const VerificarSalaUna = async(req: Request, res: Response) => {


    const { id }= req.params;

    const sala = await SalaChat.findAll({where:{ id:id }, attributes:['titulo','tiempo']})

    console.log("gatoss");

    const [{ titulo, tiempo }] = sala;


    res.json({
        ok: true,
        titulo,
        tiempo
    })


}



const verificarTokenExp = (token:string) => {
    try {
        const tokenValidar = jwt.verify(token, process.env.SECRETORPRIVATEKEY || ""); 

        if (tokenValidar){ 
            return true;
        }
        
    } catch (error) {
        return false;
    }
  


}
