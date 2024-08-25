const { isAdmin } = require('../../src/middleware/role');

describe('isAdmin Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { role: 'user' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 403 if user is not admin', () => {
        isAdmin(req, res, next);
        
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access Denied.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
        req.user.role = 'admin';
        isAdmin(req, res, next);
        
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
