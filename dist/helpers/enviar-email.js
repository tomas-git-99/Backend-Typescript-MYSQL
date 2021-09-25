"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarMail = void 0;
const sgMail = require("@sendgrid/mail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
sgMail.setApiKey(process.env.APIKEYSENDGRID || '');
const enviarMail = (email, token) => {
    sgMail.send({
        to: email,
        from: "no-replaydestructchat@outlook.com",
        subject: "¡Bienvenido!",
        text: `Gracias por resgistrarte \n Precione el boton para completar el registro`,
        html: `<a href= "https://chat-destructivo.web.app/registro/${token}">Aceptar</a>`
    }).then(resp => {
        console.log("sent email");
    })
        .catch(error => {
        console.log(error);
    });
};
exports.enviarMail = enviarMail;
//# sourceMappingURL=enviar-email.js.map