import sgMail = require("@sendgrid/mail");
import dotenv from 'dotenv';
dotenv.config();





sgMail.setApiKey(process.env.APIKEYSENDGRID || '');

export const enviarMail = (email: string, token:string) => {
    
    sgMail.send({
    
        to: email,
        from: "no-replaydestructchat@outlook.com",
        subject: "¡Bienvenido!",
        text: `Gracias por resgistrarte \n Precione el boton para completar el registro`,
        html: `<a href= "https://chat-destructivo.web.app/registro/${token}">Aceptar</a>`
    
    }).then( resp => {
        console.log("sent email")
    })
      .catch( error => {
          console.log(error);
      })

}