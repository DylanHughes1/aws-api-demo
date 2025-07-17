require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
const PORT = 3000;

const s3 = new AWS.S3();

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('photo'), async (req, res) => {
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: req.file.originalname,
        Body: fileContent,
        ContentType: req.file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        res.send({ url: data.Location });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading to S3');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});

app.use(express.static('public'));

