// delete account from user's own account page

function selfDeleteController(db, logger) {
    return function(req, res) {
        // route control logic here
        // pull userID from session
        const userID = req.user.userID;

        // Delete user from the database
        db.run(`DELETE FROM users WHERE userID = ?`, [userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error deleting user: ', err.message);
            }

            // no errors, user was deleted
            logger.info('User deleted successfully.');

            // logout
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    }
}

// export controller
module.exports = selfDeleteController;