export const alreadyAuthenticated = (req, res, next) => {
    if (req.user) {
        return res.sendStatus(200);
    }
    next();
};
export const protectedroute = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            err: true
        });
    }
    next();
};
export const errorMiddleware = (err, req, res, next) => {
    res.sendStatus(500);
};
export const adminRoute = (req, res, next) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        return res.status(401).send({
            err: true
        });
    }
    next();
};
