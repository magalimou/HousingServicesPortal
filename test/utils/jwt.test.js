const { generateAccessToken, verifyAccessToken } = require('../../src/utils/jwt');
const crypto = require('crypto');

describe('JWT Utility Functions', () => {
  
  const testPayload = { id: 1, username: 'testUser' };

  describe('generateAccessToken', () => {
    it('should generate a JWT with three parts', () => {
      const token = generateAccessToken(testPayload);
      const parts = token.split('.');
      expect(parts.length).toBe(3);
    });

    it('should encode the payload correctly', () => {
      const token = generateAccessToken(testPayload);
      const payloadBase64Url = token.split('.')[1];
      const decodedPayload = JSON.parse(Buffer.from(payloadBase64Url, 'base64url').toString());
      expect(decodedPayload).toEqual(testPayload);
    });

    it('should create a valid HMAC SHA-256 signature', () => {
      const token = generateAccessToken(testPayload);
      const [headerBase64, payloadBase64, signature] = token.split('.');
      const expectedSignature = crypto.createHmac('sha256', process.env.JWT_SECRET)
                                       .update(`${headerBase64}.${payloadBase64}`)
                                       .digest('base64')
                                       .replace(/\+/g, '-')
                                       .replace(/\//g, '_')
                                       .replace(/=/g, '');
      expect(signature).toBe(expectedSignature);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid token and return the payload', () => {
      const token = generateAccessToken(testPayload);
      const decodedPayload = verifyAccessToken(token);
      expect(decodedPayload).toEqual(testPayload);
    });

    it('should throw an error for an invalid signature', () => {
      const token = generateAccessToken(testPayload);
      const tamperedToken = token.split('.').slice(0, 2).join('.') + '.invalidsignature';
      expect(() => verifyAccessToken(tamperedToken)).toThrow('Token signature verification failed');
    });

    it('should throw an error for an expired token', () => {
      const expiredPayload = { ...testPayload, exp: Math.floor(Date.now() / 1000) - 10 };
      const token = generateAccessToken(expiredPayload);
      expect(() => verifyAccessToken(token)).toThrow('Token expired');
    });

    it('should throw an error for an invalid token structure', () => {
      const invalidToken = 'invalid.token';
      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });
  });

});
