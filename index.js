require('dotenv').config();
const express = require('express');
const app = express();
const filesRoutes = require('./routes/files');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', filesRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
