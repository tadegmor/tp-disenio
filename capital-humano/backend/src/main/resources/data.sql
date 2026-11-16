-- Competencias
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Lealtad', 'Compromiso con los valores y objetivos de la organizacion', true);
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Trabajo en Equipo', 'Colaboracion efectiva con pares y superiores', true);

-- Factores 
INSERT INTO factores (nombre, descripcion, competencia_id) VALUES ('Compromiso Institucional', 'Sentido de pertenencia', 1);
INSERT INTO factores (nombre, descripcion, competencia_id) VALUES ('Comunicacion Asertiva', 'Claridad al transmitir ideas', 2);

-- Opciones de Respuesta reutilizables
INSERT INTO opciones_respuesta (nombre) VALUES ('Escala Likert 1 a 5');
INSERT INTO opciones_respuesta (nombre) VALUES ('Si / No');

-- Preguntas
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
VALUES ('P-001', '¿Demuestra compromiso con los plazos acordados?', 'Evalua puntualidad y responsabilidad', 'ESCALA', 1, 1, false);

INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
VALUES ('P-002', '¿Comparte informacion relevante con su equipo?', 'Evalua comunicacion interna', 'ESCALA', 2, 1, false);