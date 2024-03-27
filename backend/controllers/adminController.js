// function to verify that logged in account is an admin
function adminController(req, res, next) {
    if (req.isAuthenticated() && req.user.accountType == 'super') {
        // user is an admin, proceed with whatever task
        return next();      

    } else {
        // no admin logged in, bounce to login screen
        return res.status(403).send("Unauthorized request. Admin privileges required.");
    }
}

// export function
module.exports = { adminController };
