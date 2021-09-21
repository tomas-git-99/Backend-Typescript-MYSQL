 

CREATE DATABASE "chat-desctructivo"


CREATE TABLE usuarios(
    id INT NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(50) NOT NULL,
    correo  VARCHAR(100) NOT NULL,
    password  VARCHAR(50) NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);



CREATE TABLE sala_de_chat(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    creado_por_ID INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    tiempo INT NOT NULL,
    invitado_ID INT,
    token VARCHAR(600) NOT NULL,
    estado TINYINT NOT NULL DEFAULT TRUE,
    sala_completa TINYINT NOT NULL DEFAULT FALSE,
    ultimo_msg VARCHAR(500),
    nombre_sin_registro VARCHAR(500),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY fk_creado_por_ID (creado_por_ID)
    REFERENCES usuarios (id)

);


ALTER TABLE sala_de_chat 
id_sala INT NOT NULL PRIMARY KEY AUTO_INCREMENT;
ADD token VARCHAR(600) NOT NULL;
ADD estado TINYINT NOT NULL DEFAULT TRUE;

ALTER TABLE sala_de_chat
ADD sala_completa TINYINT NOT NULL DEFAULT FALSE;

INSERT INTO sala_de_chat ( creado_por_ID, titulo, tiempo, invitado_ID, token)
VALUES 
( 13, "PRIMER SALA", 10, 20, "12345ABCD");


ALTER TABLE sala_de_chat 
ADD updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ;
ADD createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE sala_de_chat 
ADD invitado_ID INT DEFAULT 0;
FOREIGN KEY fk_invitado_ID (invitado_ID) REFERENCES usuarios(id);

ALTER TABLE sala_de_chat 
DROP invitado_ID;

ALTER TABLE sala_de_chat 
ADD ultimo_msg VARCHAR(500);
ADD total_msg INT DEFAULT 0;


CREATE VIEW sala_de_chat_view AS
SELECT id, creado_por_ID, titulo, updatedAt, ultimo_msg, invitado_ID, token, estado
FROM sala_de_chat
WHERE estado = TRUE;


ALTER TABLE sala_de_chat 
ADD nombre_sin_registro VARCHAR(500);