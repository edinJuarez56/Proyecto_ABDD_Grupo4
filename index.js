const express = require('express');
const cors = require('cors');
const supabase = require('./db'); // Cambiamos pool por supabase
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('FitHub con Supabase listo'));

// RUTA NUEVA PARA CREAR (Usa el cliente de Supabase)
app.post('/personas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('persona')
            .insert([req.body])
            .select();

        if (error) throw error;

        res.status(201).json({
            mensaje: "Persona creada exitosamente",
            persona: data[0]
        });
    } catch (err) {
        console.error("Error detallado:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
app.get('/actividad', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('actividad', 'membresia')
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

app.put('/membresias/:id', async (req, res) => {
  const id = req.params.id;
  const { tipo_plan, fecha_inicio, fecha_vencimiento, costo, estado } = req.body;

  if (!tipo_plan || !costo || !estado) {
      return res.status(400).json({
          error: 'Campos obligatorios faltantes: tipo_plan, costo y estado son requeridos.'
      });
  }

  try {
      const { data, error } = await supabase
          .from('membresia')
          .update({ tipo_plan, fecha_inicio, fecha_vencimiento, costo, estado })
          .eq('membresia_id', id)
          .select();

      if (error) throw error;

      if (!data || data.length === 0) {
          return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
      }

      res.json({
          mensaje: 'Membresía actualizada exitosamente.',
          membresia: data[0]
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});