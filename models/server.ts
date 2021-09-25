import express from 'express';
import userRouter from '../routes/usuario';
import userAuth from '../routes/auth';
import userSala from '../routes/salaChat';
import cors from 'cors';
import db from '../db/conectarDB';
import http from 'http' 
import * as SocketIO  from 'socket.io'




class ServerApp {

    private app: express.Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios',
        auth:'/api/auth',
        sala:'/api/sala',

    };
    private httpServer: http.Server;
    private io: SocketIO.Server;

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT || '8000';
        this.httpServer = new http.Server(this.app)
        this.io     = new SocketIO.Server(this.httpServer, { 
            cors:{
                origin:"https://chat-destructivo.web.app",
            }
         });
/*         this.io     = require("socket.io")(this.server, { 
            cors:{
                origin:"http://localhost:4200",
            }
 });
 */

       
        /* middleware */
        this.middlewares();

        /* base de datos */
        this.dbConencion();

        /* Definnir routas */
        this.router();

        this.escucharSockets()
     


    }
    async dbConencion(){
        try {
            await db.authenticate();
            console.log('base de datos conectada');
        } catch (error) {
            throw new Error("error" + error);
        }
    }

    middlewares(){

        this.app.use (function (req, res, next) {
            res.header ("Access-Control-Allow-Origin", "*");
            next();
            });
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    router(){
        this.app.use( this.apiPaths.usuarios, userRouter )
        this.app.use( this.apiPaths.auth,     userAuth )
        this.app.use( this.apiPaths.sala,     userSala )
    }
/*     socket(){

        this.io.on( 'connection', (socket: SocketIO.Socket) => {
            
           console.log('conectado')
        });


    }
 */
    private escucharSockets() {

        this.io.on( 'connection', cliente => {
            console.log('cliente conectado ' + cliente.id)
        })
    }

    listen(){
        this.httpServer.listen(this.port, () => console.log(`En el port ${this.port}`))
    }
}


export default ServerApp;