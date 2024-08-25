const authMiddleware = require('../../src/middleware/auth');
const { verifyAccessToken } = require('../../src/utils/jwt');
const db = require('../../src/models/db');

jest.mock('../../src/utils/jwt');
jest.mock('../../src/models/db');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 401 if authorization header is missing', async () => {
        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header missing.' });
    });

    it('should return 401 if token is missing', async () => {
        req.headers.authorization = 'Bearer ';
        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token missing.' });
    });

    it('should return 401 if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid_token';
        verifyAccessToken.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
    });

    it('should call next if token is valid and user exists', async () => {
        req.headers.authorization = 'Bearer valid_token';
        const user = { id: 1 };
        verifyAccessToken.mockReturnValue(user);
        db.query.mockResolvedValue([[{ id: 1, role: 'user' }]]);

        await authMiddleware(req, res, next);

        expect(req.user).toEqual({ id: 1, role: 'user' });
        expect(next).toHaveBeenCalled();
    });
});