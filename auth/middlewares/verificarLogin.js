export default function isAuthenticated(req, res, next) {
    if (req.session.login) {
        return next();
    }

    return res.redirect('/login');
}
