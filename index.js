const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hello from AWS API!');
});

// Ruta ejemplo para subir datos
app.post('/data', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Received: ${name}` });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
