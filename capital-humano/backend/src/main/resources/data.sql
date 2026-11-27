-- =====================================================================
-- Datos de prueba (H2). No se fijan ids: las FK se resuelven por valores unicos.
-- =====================================================================

-- ---------- Competencias ----------
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Lealtad', 'Compromiso con los valores y objetivos de la organizacion', true);
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Trabajo en Equipo', 'Colaboracion efectiva con pares y superiores', true);
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Toma de Decisiones', 'Capacidad de decidir con informacion incompleta', true);
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Liderazgo', 'Capacidad de guiar y motivar a un equipo', true);
INSERT INTO competencias (nombre, descripcion, activa) VALUES ('Negociación', 'Capacidad de llegar a acuerdos beneficiosos', true);

-- ---------- Factores ----------
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Compromiso Institucional', 'Sentido de pertenencia', id FROM competencias WHERE nombre = 'Lealtad';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Credibilidad', 'Coherencia entre lo que dice y hace', id FROM competencias WHERE nombre = 'Lealtad';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Comunicacion Asertiva', 'Claridad al transmitir ideas', id FROM competencias WHERE nombre = 'Trabajo en Equipo';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Colaboracion', 'Disposicion a ayudar a los demas', id FROM competencias WHERE nombre = 'Trabajo en Equipo';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Analisis de Riesgos', 'Evaluar consecuencias antes de decidir', id FROM competencias WHERE nombre = 'Toma de Decisiones';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Delegacion', 'Asignar tareas segun capacidades', id FROM competencias WHERE nombre = 'Liderazgo';
INSERT INTO factores (nombre, descripcion, competencia_id) SELECT 'Persuasion', 'Convencer con argumentos', id FROM competencias WHERE nombre = 'Negociación';

-- ---------- Opciones de respuesta reutilizables ----------
INSERT INTO opciones_respuesta (nombre, descripcion, activa) VALUES ('Escala Likert 1 a 5', 'Escala de frecuencia de 5 niveles', true);
INSERT INTO opciones_respuesta (nombre, descripcion, activa) VALUES ('Si / No', 'Respuesta dicotómica', true);
INSERT INTO opciones_respuesta (nombre, descripcion, activa) VALUES ('Verdadero / Falso', 'Respuesta booleana', true);

-- ---------- Items de opciones de respuesta ----------
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 1, 'NUNCA', id FROM opciones_respuesta WHERE nombre = 'Escala Likert 1 a 5';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 2, 'RARA VEZ', id FROM opciones_respuesta WHERE nombre = 'Escala Likert 1 a 5';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 3, 'A VECES', id FROM opciones_respuesta WHERE nombre = 'Escala Likert 1 a 5';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 4, 'FRECUENTEMENTE', id FROM opciones_respuesta WHERE nombre = 'Escala Likert 1 a 5';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 5, 'SIEMPRE', id FROM opciones_respuesta WHERE nombre = 'Escala Likert 1 a 5';

INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 1, 'SI', id FROM opciones_respuesta WHERE nombre = 'Si / No';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 2, 'NO', id FROM opciones_respuesta WHERE nombre = 'Si / No';

INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 1, 'VERDADERO', id FROM opciones_respuesta WHERE nombre = 'Verdadero / Falso';
INSERT INTO items_opcion (orden, descripcion, opcion_respuesta_id) SELECT 2, 'FALSO', id FROM opciones_respuesta WHERE nombre = 'Verdadero / Falso';

-- ---------- Preguntas ----------
-- Evaluables (factor con 2 o mas preguntas): Compromiso Institucional (2), Comunicacion Asertiva (2), Analisis de Riesgos (3)
-- No evaluables: Colaboracion (1), Delegacion (1 activa + 1 eliminada), Credibilidad y Persuasion (0)
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-001', '¿Demuestra compromiso con los plazos acordados?', 'Evalua puntualidad y responsabilidad', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Compromiso Institucional' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-002', '¿Defiende los intereses de la organizacion ante terceros?', 'Evalua lealtad institucional', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Compromiso Institucional' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-003', '¿Comparte informacion relevante con su equipo?', 'Evalua comunicacion interna', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Comunicacion Asertiva' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-004', '¿Expresa su desacuerdo de manera respetuosa?', 'Evalua asertividad', 'VERDADERO_FALSO', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Comunicacion Asertiva' AND o.nombre = 'Si / No';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-005', '¿Ayuda a sus companeros cuando lo necesitan?', 'Evalua colaboracion', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Colaboracion' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-006', '¿Asigna tareas segun las capacidades de cada persona?', 'Evalua delegacion', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Delegacion' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-007', '¿Evalua las consecuencias antes de decidir?', 'Evalua analisis de riesgos', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Analisis de Riesgos' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-008', '¿Consulta alternativas antes de tomar una decision importante?', 'Evalua analisis de riesgos', 'ESCALA', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Analisis de Riesgos' AND o.nombre = 'Escala Likert 1 a 5';
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-009', '¿Asume la responsabilidad de sus decisiones?', 'Evalua analisis de riesgos', 'VERDADERO_FALSO', f.id, o.id, false
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Analisis de Riesgos' AND o.nombre = 'Si / No';
-- Pregunta dada de baja: no debe contarse para que Delegacion sea evaluable
INSERT INTO pregunta (nombre, enunciado, descripcion, tipo, id_factor, id_opcion_respuesta, eliminado)
SELECT 'P-010', '¿Reconoce el trabajo bien hecho de su equipo?', 'Pregunta eliminada', 'ESCALA', f.id, o.id, true
FROM factores f, opciones_respuesta o WHERE f.nombre = 'Delegacion' AND o.nombre = 'Escala Likert 1 a 5';

-- ---------- Puestos ----------
INSERT INTO puestos (codigo, nombre, empresa, eliminado) VALUES ('P001', 'Desarrollador Java Senior', 'Tech Solutions', false);
INSERT INTO puestos (codigo, nombre, empresa, eliminado) VALUES ('P002', 'Analista Funcional', 'Tech Solutions', false);
INSERT INTO puestos (codigo, nombre, empresa, eliminado) VALUES ('P003', 'Jefe de Cocina', 'Paladar Negro', false);
INSERT INTO puestos (codigo, nombre, empresa, eliminado) VALUES ('P099', 'Puesto dado de baja', 'Tech Solutions', true);

-- ---------- Competencias requeridas por puesto (ponderacion) ----------
-- P001 y P002 son evaluables; P003 no (Liderazgo y Negociación sin factores aptos -> flujo alternativo 9.A)
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 10 FROM puestos p, competencias c WHERE p.codigo = 'P001' AND c.nombre = 'Lealtad';
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 8 FROM puestos p, competencias c WHERE p.codigo = 'P001' AND c.nombre = 'Trabajo en Equipo';
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 9 FROM puestos p, competencias c WHERE p.codigo = 'P002' AND c.nombre = 'Toma de Decisiones';
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 7 FROM puestos p, competencias c WHERE p.codigo = 'P002' AND c.nombre = 'Trabajo en Equipo';
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 10 FROM puestos p, competencias c WHERE p.codigo = 'P003' AND c.nombre = 'Liderazgo';
INSERT INTO puesto_competencias (puesto_id, competencia_id, ponderacion) SELECT p.id, c.id, 8 FROM puestos p, competencias c WHERE p.codigo = 'P003' AND c.nombre = 'Negociación';

-- ---------- Candidatos ----------
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Rodriguez', 'Claudio', 'DNI', '22222222', '010', false);
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Dominguez', 'Carla', 'DNI', '27123456', '012', false);
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Perez', 'Marcos', 'DNI', '30456789', '014', false);
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Diaz', 'Victoria', 'DNI', '33333333', '018', false);
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Gomez', 'Maria', 'DNI', '40987654', '020', false);
-- Candidato dado de baja: no debe aparecer en la busqueda
INSERT INTO candidatos (apellido, nombre, tipo_documento, numero_documento, numero_candidato, eliminado) VALUES ('Eliminado', 'Candidato', 'DNI', '11111111', '099', true);

-- ---------- Evaluacion previa con cuestionarios en distintos estados ----------
INSERT INTO evaluaciones (puesto_id, fecha_creacion) SELECT id, CURRENT_TIMESTAMP FROM puestos WHERE codigo = 'P001';

-- 010 Rodriguez: ACTIVO     -> bloquea una nueva evaluacion (flujo alternativo 6.A)
INSERT INTO cuestionarios (evaluacion_id, candidato_id, clave_ingreso, fecha_creacion, fecha_inicio, fecha_fin, ultimo_ingreso, fecha_cambio_estado, estado, cantidad_accesos, cantidad_maxima_accesos, cantidad_preguntas_por_factor, cantidad_preguntas_por_bloque, tiempo_maximo_activo, tiempo_maximo_completar)
SELECT e.id, c.id, 'A1S2D3F4', CURRENT_TIMESTAMP, NULL, NULL, NULL, CURRENT_TIMESTAMP, 'ACTIVO', 0, 3, 2, 5, 72, 90
FROM evaluaciones e, candidatos c WHERE c.numero_candidato = '010';

-- 014 Perez: EN_PROCESO     -> tambien bloquea
INSERT INTO cuestionarios (evaluacion_id, candidato_id, clave_ingreso, fecha_creacion, fecha_inicio, fecha_fin, ultimo_ingreso, fecha_cambio_estado, estado, cantidad_accesos, cantidad_maxima_accesos, cantidad_preguntas_por_factor, cantidad_preguntas_por_bloque, tiempo_maximo_activo, tiempo_maximo_completar)
SELECT e.id, c.id, 'G5H6J7K8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'EN_PROCESO', 1, 3, 2, 5, 72, 90
FROM evaluaciones e, candidatos c WHERE c.numero_candidato = '014';

-- 012 Dominguez: COMPLETO   -> se la puede volver a evaluar
INSERT INTO cuestionarios (evaluacion_id, candidato_id, clave_ingreso, fecha_creacion, fecha_inicio, fecha_fin, ultimo_ingreso, fecha_cambio_estado, estado, cantidad_accesos, cantidad_maxima_accesos, cantidad_preguntas_por_factor, cantidad_preguntas_por_bloque, tiempo_maximo_activo, tiempo_maximo_completar)
SELECT e.id, c.id, 'L9M2N3P4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'COMPLETO', 1, 3, 2, 5, 72, 90
FROM evaluaciones e, candidatos c WHERE c.numero_candidato = '012';

-- =====================================================================
-- Datos adicionales para CU028 - Emitir Orden de Mérito (sobre P001)
-- =====================================================================

INSERT INTO cuestionarios (evaluacion_id, candidato_id, clave_ingreso, fecha_creacion, fecha_inicio, fecha_fin, ultimo_ingreso, fecha_cambio_estado, estado, cantidad_accesos, cantidad_maxima_accesos, cantidad_preguntas_por_factor, cantidad_preguntas_por_bloque, tiempo_maximo_activo, tiempo_maximo_completar)
SELECT e.id, c.id, 'Q1W2E3R4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'COMPLETO', 2, 3, 2, 5, 72, 90
FROM evaluaciones e, candidatos c WHERE c.numero_candidato = '018';

INSERT INTO cuestionarios (evaluacion_id, candidato_id, clave_ingreso, fecha_creacion, fecha_inicio, fecha_fin, ultimo_ingreso, fecha_cambio_estado, estado, cantidad_accesos, cantidad_maxima_accesos, cantidad_preguntas_por_factor, cantidad_preguntas_por_bloque, tiempo_maximo_activo, tiempo_maximo_completar)
SELECT e.id, c.id, 'T5Y6U7I8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'COMPLETO', 1, 3, 2, 5, 72, 90
FROM evaluaciones e, candidatos c WHERE c.numero_candidato = '020';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 12.0, 10.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '018' AND comp.nombre = 'Lealtad';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 10.0, 8.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '018' AND comp.nombre = 'Trabajo en Equipo';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 10.0, 10.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '012' AND comp.nombre = 'Lealtad';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 9.0, 8.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '012' AND comp.nombre = 'Trabajo en Equipo';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 11.0, 10.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '020' AND comp.nombre = 'Lealtad';

INSERT INTO resultados (cuestionario_id, competencia_id, candidato_id, puntaje_obtenido, puntaje_requerido, fecha_calculo)
SELECT cu.id, comp.id, cand.id, 5.0, 8.0, CURRENT_TIMESTAMP
FROM cuestionarios cu JOIN candidatos cand ON cu.candidato_id = cand.id, competencias comp
WHERE cand.numero_candidato = '020' AND comp.nombre = 'Trabajo en Equipo';