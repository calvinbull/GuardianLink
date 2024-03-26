// function to verify that a user is logged out
function loggedOutController(req, res, next) {
    if (req.isAuthenticated()) {
        // user logged in, bounce to home screen
        res.redirect('/');
    } else {
        // user is logged out, proceed with whatever task
        return next();
    }
}

// export function
module.exports = { loggedOutController };