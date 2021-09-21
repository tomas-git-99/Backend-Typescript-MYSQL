import { Usuario } from "../models/usuario"





export const correoExiste = async (correo: string = "") => {

    const correoExiste = await Usuario.findOne({where: {correo:correo}})

    if (correoExiste){
        throw new Error (`el correo ${correo} ya esta registrado`)
    }
}






//SALA CHAT 