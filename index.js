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