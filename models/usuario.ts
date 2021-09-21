import {DataTypes, Model} from 'sequelize';
import db from '../db/conectarDB';


export interface TodoAtributos {
    nombre: string;
    correo: string;
    password: string;
    estado: boolean;
}


export class Usuario extends Model <TodoAtributos>{

    public nombre!: string;
    public correo!: string;
    public password!: string;
    public estado!: boolean;

}


Usuario.init(
    {
        nombre:{
            type:DataTypes.STRING
        },
        correo:{
            type:DataTypes.STRING,
        },
        password:{
            type:DataTypes.STRING
        },
        estado:{
            type:DataTypes.BOOLEAN

        }
    },{
        sequelize: db,
        tableName: "usuarios"
    }
)


