const { saveFileRecord, listFiles, deleteFileFromDynamo } = require('../services/dynamoService');
const { uploadFileToS3, deleteFileFromS3 } = require('../services/s3Service');

const getFiles = async (req, res) => {
    try {
        const files = await listFiles();
        res.json(files);
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se envió ningún archivo' });
        }

        const s3Data = await uploadFileToS3(req.file);

        await saveFileRecord({
            id: req.file.filename,
            filename: req.file.originalname,
            url: s3Data.url,
            uploadDate: new Date().toISOString(),
        });

        res.status(201).json({ message: 'Archivo subido exitosamente', s3Data });
    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({ message: 'Error al subir el archivo' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) return res.status(400).json({ message: 'Falta la key del archivo' });

        await deleteFileFromS3(key);
        await deleteFileFromDynamo(key);

        res.json({ message: 'Archivo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).json({ message: 'Error al eliminar el archivo' });
    }
};


module.exports = {
    getFiles,
    uploadFile,
    deleteFile
};