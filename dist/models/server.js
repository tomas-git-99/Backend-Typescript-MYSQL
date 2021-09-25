"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuario_1 = __importDefault(require("../routes/usuario"));
const auth_1 = __importDefault(require("../routes/auth"));
const salaChat_1 = __importDefault(require("../routes/salaChat"));
const cors_1 = __importDefault(require("cors"));
const conectarDB_1 = __importDefault(require("../db/conectarDB"));
const http_1 = __importDefault(require("http"));
const SocketIO = __importStar(require("socket.io"));
class ServerApp {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            sala: '/api/sala',
        };
        this.app = express_1.default();
        this.port = process.env.PORT || '8000';
        this.httpServer = new http_1.default.Server(this.app);
        this.io = new SocketIO.Server(this.httpServer, {
            cors: {
                origin: "https://chat-destructivo.web.app",
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
        this.escucharSockets();
    }
    dbConencion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield conectarDB_1.default.authenticate();
                console.log('base de datos conectada');
            }
            catch (error) {
                throw new Error("error" + error);
            }
        });
    }
    middlewares() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            next();
        });
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static('public'));
    }
    router() {
        this.app.use(this.apiPaths.usuarios, usuario_1.default);
        this.app.use(this.apiPaths.auth, auth_1.default);
        this.app.use(this.apiPaths.sala, salaChat_1.default);
    }
    /*     socket(){
    
            this.io.on( 'connection', (socket: SocketIO.Socket) => {
                
               console.log('conectado')
            });
    
    
        }
     */
    escucharSockets() {
        this.io.on('connection', cliente => {
            console.log('cliente conectado ' + cliente.id);
        });
    }
    listen() {
        this.httpServer.listen(this.port, () => console.log(`En el port ${this.port}`));
    }
}
exports.default = ServerApp;
//# sourceMappingURL=server.js.map