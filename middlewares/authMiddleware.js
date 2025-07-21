const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

let pems = null;

const getPems = async () => {
    if (pems) return pems;

    const { data } = await axios.get(`https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`);
    pems = {};
    data.keys.forEach(key => {
        pems[key.kid] = jwkToPem(key);
    });

    return pems;
};

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
        const decoded = jwt.decode(token, { complete: true });
        const pems = await getPems();
        const pem = pems[decoded.header.kid];

        jwt.verify(token, pem, (err, payload) => {
            if (err) return res.status(401).json({ message: 'Token inválido' });

            req.user = payload;
            next();
        });
    } catch (err) {
        res.status(401).json({ message: 'Token inválido', error: err.message });
    }
};

module.exports = verifyToken;
