import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const generarJWT = async ( id:string= '') => {

    try {
        const payload = {id};
        const token = await jwt.sign(payload, process.env.SECRETORPRIVATEKEY ||'',{
            expiresIn:'4h'
        })
        if (!token){
            throw new Error('No se pudo generar el token');
        }
        
        return token;
        
    } catch (error) {
        throw new Error (error);
    }

}

export const generarJWTconSala = async ( id:string= '', tiempo:number ) => {

    let SumaMisegundos = tiempo * 60000;

    try {
        const payload = {id};
        const token = await jwt.sign(payload, process.env.SECRETORPRIVATEKEY ||'',{
            
            expiresIn: `${SumaMisegundos}`
        })
        if (!token){
            throw new Error('No se pudo generar el token');
        }
        
        return token;
        
    } catch (error) {
        throw new Error (error);
    }

}

export const generarJWTsinRegistro = async ( id:string= '') =>{
    try {
        const payload = {id};
        const token = await jwt.sign(payload, process.env.SECRETORPRIVATEKEYSINREGISTRO ||'',{

            expiresIn:'4h'
            
        })
        if (!token){
            throw new Error('No se pudo generar el token');
        }
        
        return token;
        
    } catch (error) {
        throw new Error (error);
    }
}