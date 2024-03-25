// function to verify that a user is logged in
function authorizationController(req, res, next) {
    if (req.isAuthenticated()) {
        // user is logged in, proceed with whatever task
        return next();
    } else {
        // no user logged in, bounce to login screen
        res.redirect('/login');
    }
}

// export function
module.exports = { authorizationController };
