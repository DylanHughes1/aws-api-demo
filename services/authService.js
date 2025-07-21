global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const crypto = require('crypto');
const AWS = require('aws-sdk');

const userPoolId = process.env.USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;
const clientSecret = process.env.COGNITO_CLIENT_SECRET;

if (!userPoolId || !clientId || !clientSecret) {
    throw new Error('Faltan variables de entorno: USER_POOL_ID, COGNITO_CLIENT_ID o COGNITO_CLIENT_SECRET');
}

const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
};

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

const generateSecretHash = (username, clientId, clientSecret) => {
    return crypto
        .createHmac('SHA256', clientSecret)
        .update(username + clientId)
        .digest('base64');
}

const loginUser = async (email, password) => {
    const secretHash = generateSecretHash(email, clientId, clientSecret);

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: secretHash,
        }
    };

    try {
        const response = await cognitoISP.initiateAuth(params).promise();
        return {
            idToken: response.AuthenticationResult.IdToken,
            accessToken: response.AuthenticationResult.AccessToken,
            refreshToken: response.AuthenticationResult.RefreshToken,
        };
    } catch (err) {
        throw {
            message: 'Credenciales inválidas',
            error: err.message || err,
        };
    }
};

const signUpUser = (email, password) => {
    const params = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ],
        SecretHash: generateSecretHash(email, poolData.ClientId, clientSecret)

    };

    return cognitoISP.signUp(params).promise();
};


module.exports = { loginUser, signUpUser };
