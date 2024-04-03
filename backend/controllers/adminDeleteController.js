// admin route to delete any given account by userID

function adminDeleteController(db, logger) {
    return function(req, res) {
        // route control logic here

        // pull userID from admin's request body
        const userID = req.body.userToDelete;

        // Delete user from the database
        db.run(`DELETE FROM users WHERE userID = ?`, [userID], (err) => {
            if (err) {
                console.error(err.message);
                logger.error('Error deleting user: ', err.message);
                // send error response
                res.status(500).send('Error deleting user');
            } else {
                logger.info('User deleted successfully');
                // send 'ok' response
                res.status(200).send('User deleted successfully');
            }
        });
    }
}

// export controller
module.exports = adminDeleteController;