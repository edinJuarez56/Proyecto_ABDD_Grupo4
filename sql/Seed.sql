INSERT INTO persona (nombres, apellidos, email, fecha_nacimiento, dir_calle, dir_ciudad, dir_departamento, dir_pais)
VALUES
('Juan Carlos', 'Lopez Rivera', 'juan.lopez@gmail.com', '1998-05-15', 'Colonia Kennedy', 'Tegucigalpa', 'Francisco Morazán', 'Honduras'),
('María Fernanda', 'Hernández Cruz', 'mafe.hernandez@hotmail.com', '2000-11-22', 'Barrio El Centro', 'San Pedro Sula', 'Cortés', 'Honduras'),
('Carlos Eduardo', 'Pérez Ramírez', 'carlos.perez05@gmail.com', '1997-03-10', 'Residencial Los Pinos', 'La Ceiba', 'Atlántida', 'Honduras'),
('Ana Sofía', 'Rodríguez López', 'anasofi.rodriguez@gmail.com', '2001-07-30', 'Colonia 21 de Febrero', 'Comayagua', 'Comayagua', 'Honduras'),
('Luis Fernando', 'García Morales', 'luisfer.garcia@yahoo.com', '1999-01-15', 'Barrio La Paz', 'Choluteca', 'Choluteca', 'Honduras'),
('Valeria Isabel', 'Cruz Mendoza', 'vale.cruz05@gmail.com', '2002-09-22', 'Colonia Las Brisas', 'Santa Bárbara', 'Santa Bárbara', 'Honduras'),
('Diego Armando', 'Vásquez Torres', 'diego.vasquez@icloud.com', '1998-04-10', 'Residencial El Prado', 'Danlí', 'El Paraíso', 'Honduras'),
('Sofía Alejandra', 'Reyes Castillo', 'sofi.reyes2004@gmail.com', '2004-12-03', 'Colonia Moderna', 'Tela', 'Atlántida', 'Honduras');

INSERT INTO persona_telefono (persona_id, telefono, tipo) VALUES
(1, '9988-7744', 'celular'),
(1, '2233-4455', 'casa'),
(2, '9876-5432', 'celular'),
(3, '9456-7890', 'celular'),
(4, '9765-4321', 'celular'),
(5, '9123-4567', 'celular'),
(6, '9567-8901', 'celular'),
(7, '9345-6789', 'celular'),
(8, '9678-9012', 'celular');

INSERT INTO cliente (persona_id) VALUES (1), (2), (3), (4), (5), (6), (7), (8);

INSERT INTO entrenador (persona_id, especialidad) VALUES 
(3, 'Yoga y Funcional'),
(5, 'Spinning y Cardio'),
(7, 'Nutrición y Personal Training');

INSERT INTO sede (nombre, dir_calle, dir_ciudad) VALUES
('FitHub Tegucigalpa', 'Boulevard Suyapa', 'Tegucigalpa'),
('FitHub SPS', 'Colonia Trejo', 'San Pedro Sula'),
('FitHub La Ceiba', 'Avenida 14 de Julio', 'La Ceiba');

INSERT INTO actividad (sede_id, entrenador_id, tipo, nombre, horario, cupo_maximo, costo_base) VALUES
(1, 3, 'clase_grupal', 'Yoga Mañana', 'Lunes y Miercoles 07:00', 15, 150.00),
(1, 5, 'clase_grupal', 'Spinning Intenso', 'Martes y Jueves 18:00', 20, 180.00),
(2, 7, 'servicio', 'Evaluacion Fisica', 'Viernes 09:00', 5, 350.00),
(1, 3, 'clase_grupal', 'Funcional Full Body', 'Sabado 08:00', 18, 200.00),
(3, 5, 'clase_grupal', 'CrossFit Básico', 'Lunes 17:00', 12, 220.00);

INSERT INTO reserva (cliente_id, actividad_id, estado, precio_aplicado) VALUES
(1, 1, 'confirmada', 150.00),
(2, 2, 'creada', 180.00),
(4, 1, 'confirmada', 150.00),
(6, 4, 'creada', 200.00),
(8, 3, 'confirmada', 350.00),
(3, 5, 'cancelada', 220.00);

INSERT INTO membresia (cliente_id, tipo, fecha_inicio, fecha_vencimiento, costo, estado) VALUES
(1, 'mensual', '2026-03-01', '2026-04-01', 899.00, 'activa'),
(2, 'trimestral', '2026-02-15', '2026-05-15', 2400.00, 'activa'),
(4, 'premium', '2026-01-10', '2026-07-10', 4500.00, 'activa'),
(7, 'mensual', '2026-03-20', '2026-04-20', 899.00, 'activa');

INSERT INTO pago (monto, metodo, referencia, reserva_id, membresia_id) VALUES
(150.00, 'tarjeta', 'TXN-998877', 1, NULL),
(899.00, 'transferencia', 'TRF-445566', NULL, 1),
(180.00, 'efectivo', 'EF-334455', 2, NULL),
(350.00, 'tarjeta', 'TXN-112233', 5, NULL),
(2400.00, 'transferencia', 'TRF-778899', NULL, 2);


SELECT 'Datos insertados correctamente' AS mensaje;