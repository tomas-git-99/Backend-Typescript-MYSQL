import {DataTypes, Model} from 'sequelize';
import db from '../db/conectarDB';


export interface Salainfo {

    creado_por_ID:number;
    titulo: string;
    invitado_ID: number;
    tiempo: number;
    token: string;
    estado: boolean;
    sala_completa: boolean;
    ultimo_msg: string;
    id:number;
    nombre_sin_registro:string;
}

export class SalaChat extends Model <Salainfo>{
    public creado_por_ID!:number;
    public titulo!: string;
    public invitado_ID!: number;
    public tiempo!: number;
    public token!: string;
    public estado!: boolean;
    public sala_completa!: boolean;
    public ultimo_msg!: string;
    public id!:number;
    public nombre_sin_registro!:string;


}


SalaChat.init(
    {
        creado_por_ID:{
            type:DataTypes.NUMBER,
        },
        titulo:{
            type:DataTypes.STRING,
        },
        invitado_ID:{
            type:DataTypes.NUMBER
        },
        tiempo:{
            type:DataTypes.NUMBER

        },
        token:{
            type:DataTypes.STRING //el momento que el chat se termina             
        },
        estado:{
            type:DataTypes.BOOLEAN //si la sala sigue o no
        },
        sala_completa:{
            type:DataTypes.BOOLEAN, //si en la sala ya entro el usuario
        },
        ultimo_msg:{
            type:DataTypes.STRING,
        },
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,

        },
        nombre_sin_registro:{
            type:DataTypes.STRING
        }

        
    },{
        freezeTableName: true,
        sequelize: db,
        tableName: "sala_de_chat"
    }
)
