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
})