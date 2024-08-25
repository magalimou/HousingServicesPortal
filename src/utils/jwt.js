const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const SECRET = process.env.JWT_SECRET;

exports.generateAccessToken = (payload) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const headerBase64Url = encodeBase64Url(Buffer.from(JSON.stringify(header)).toString('base64'));
  const payloadBase64Url = encodeBase64Url(Buffer.from(JSON.stringify(payload)).toString('base64'));

  const signature = createHmacSHA256Signature(headerBase64Url, payloadBase64Url);

  const jwt = `${headerBase64Url}.${payloadBase64Url}.${signature}`;
  console.log(jwt);

  return jwt;
};

function createHmacSHA256Signature(headerBase64Url, payloadBase64Url) {
  const signatureInput = `${headerBase64Url}.${payloadBase64Url}`;
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(signatureInput);
  return encodeBase64Url(hmac.digest('base64'));
}

function encodeBase64Url(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

exports.verifyAccessToken = (token) => {
  const [headerBase64, payloadBase64, providedSignature] = token.split('.');

  const expectedSignature = createHmacSHA256Signature(headerBase64, payloadBase64);

  if (providedSignature !== expectedSignature) {
    throw new Error('Token signature verification failed');
  }

  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());

  if (payload.exp && payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return payload;
};


  

  

