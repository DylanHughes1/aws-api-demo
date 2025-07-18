const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3();

const uploadFileToS3 = async (file) => {
    const fileContent = fs.readFileSync(file.path);

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: file.filename,
        Body: fileContent,
        ContentType: file.mimetype,
    };

    await s3.upload(params).promise();

    // Eliminamos archivo local
    fs.unlinkSync(file.path);

    return {
        key: file.filename,
        url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
    };
};

const listAllFiles = async () => {
    const params = {
        Bucket: process.env.S3_BUCKET,
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents.map(item => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        url: `https://${params.Bucket}.s3.amazonaws.com/${item.Key}`,
    }));
};

module.exports = {
    uploadFileToS3,
    listAllFiles
};
