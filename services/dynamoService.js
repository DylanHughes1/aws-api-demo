const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

async function saveFileRecord({ id, filename, url, uploadDate }) {
    const params = {
        TableName: 'Files',
        Item: {
            fileId: id,
            filename,
            url,
            uploadedAt: uploadDate
        }
    };

    await dynamo.put(params).promise();
}


async function listFiles() {
    const params = {
        TableName: 'Files'
    };

    const data = await dynamo.scan(params).promise();
    return data.Items;
}

module.exports = {
    saveFileRecord,
    listFiles
};
