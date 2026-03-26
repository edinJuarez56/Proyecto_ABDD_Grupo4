const express = require('express');
const cors = require('cors');
const supabase = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('FitHub con Supabase listo'));

//PARTE DE REGISTRO 
app.post('/personas', async (req, res) => {
    try {
        // 1.Para extraer los datos del body de Postman
        const { 
            nombres, apellidos, email, fecha_nacimiento, 
            dir_calle, dir_ciudad, dir_departamento, dir_pais,
            telefono, especialidad 
        } = req.body;

        // 2. para filtrar solo lo que va en la tabla persona
        const objetoPersona = { 
            nombres, apellidos, email, fecha_nacimiento, 
            dir_calle, dir_ciudad, dir_departamento, dir_pais 
        };

        // 3. para insertar en PERSONA y obtener el id generado
        const { data: personaData, error: personaError } = await supabase
            .from('persona')
            .insert([objetoPersona])
            .select()
            .single();

        if (personaError) throw personaError;

        const personaId = personaData.persona_id;

        // 4. Si se mando telefono, se guardaea en persona_telefono 
        if (telefono) {
            await supabase
                .from('persona_telefono')
                .insert([{ 
                    persona_id: personaId, 
                    telefono: telefono, 
                    tipo: 'celular' 
                }]);
        }
        // 5. Si se mando especialidad se guardara en ENTRENADOR
        if (especialidad) {
            await supabase
                .from('entrenador')
                .insert([{ persona_id: personaId, especialidad: especialidad }]);
        }

        res.status(201).json({
            mensaje: "Registrado correctamente en Persona, Telefono y Entrenador",
            persona_creada: personaData
        });

    } catch (err) {
        console.error("Error detallado:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// RUTAS DE ACTIVIDAD 
app.get('/actividad', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('actividad')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/test', (req, res) => {
  res.send('OK')
})
app.get('/actividades/:id', async (req, res) => {
  const id = req.params.id

  try {
    const { data, error } = await supabase
      .from('actividad')
      .select('*')
      .eq('actividad_id', id)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ mensaje: 'Actividad no encontrada' })
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

// UPDATE COMPLETO — Actualizar toda la membresía
app.put('/membresias/:id', async (req, res) => {
    const id = req.params.id;
    const { tipo, cliente_id, fecha_inicio, fecha_vencimiento, costo, estado } = req.body;

    if (!tipo || !costo || !estado) {
        return res.status(400).json({
            error: 'Campos obligatorios faltantes: tipo, costo y estado son requeridos.'
        });
    }

    try {
        const { data, error } = await supabase
            .from('membresia')
            .update({ tipo, cliente_id, fecha_inicio, fecha_vencimiento, costo, estado })
            .eq('membresia_id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
        }
        res.json({ mensaje: 'Membresía actualizada exitosamente.', membresia: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE PARCIAL DE PRECIO — Solo cambia el costo
app.patch('/membresias/:id/precio', async (req, res) => {
    const id = req.params.id;
    const { costo } = req.body;

    if (costo === undefined || costo === null) {
        return res.status(400).json({ error: 'El campo costo es requerido.' });
    }
    if (typeof costo !== 'number' || costo < 0) {
        return res.status(400).json({ error: 'El costo debe ser un número positivo.' });
    }

    try {
        const { data, error } = await supabase
            .from('membresia')
            .update({ costo })
            .eq('membresia_id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
        }
        res.json({ mensaje: `Precio actualizado a L. ${costo} exitosamente.`, membresia: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE PARCIAL DE PLAN Y ESTADO — Solo cambia tipo o estado
app.patch('/membresias/:id/plan', async (req, res) => {
    const id = req.params.id;
    const { tipo, estado } = req.body;

    if (!tipo && !estado) {
        return res.status(400).json({
            error: 'Debe enviar al menos tipo o estado para actualizar.'
        });
    }

    const estadosValidos = ['activa', 'vencida', 'cancelada'];
    if (estado && !estadosValidos.includes(estado)) {
        return res.status(400).json({
            error: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}.`
        });
    }

    const planesValidos = ['mensual', 'trimestral', 'premium'];
    if (tipo && !planesValidos.includes(tipo)) {
        return res.status(400).json({
            error: `Tipo inválido. Valores permitidos: ${planesValidos.join(', ')}.`
        });
    }

    const camposAActualizar = {};
    if (tipo) camposAActualizar.tipo = tipo;
    if (estado) camposAActualizar.estado = estado;

    try {
        const { data, error } = await supabase
            .from('membresia')
            .update(camposAActualizar)
            .eq('membresia_id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
        }
        res.json({ mensaje: 'Plan/estado de membresía actualizado exitosamente.', membresia: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
