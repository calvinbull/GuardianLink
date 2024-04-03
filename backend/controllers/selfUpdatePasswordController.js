 // controller for /auth/newPassword route

// password reset
function selfUpdatePasswordController(db, logger, bcrypt) { 
    return function (req, res) {
        // pull new password from session
        const { password } = req.body;

        // proceed to update password.
        db.run(`UPDATE users SET password = ? WHERE username = ?`, 
                [ bcrypt.hashSync(password, Number(process.env.BCRYPT_SALT_ROUNDS)), req.user.username ], (err) => {
            if (err) {
                // password not updated in DB
                console.error(err.message);
                logger.error('Error updating user password: ', err.message);
                res.json({ message: 'Error updating user password.' });
            } else {
                // new password is set
                logger.info('User password updated successfully');
                res.json({ message: 'User password updated successfully.' });
            }
        });
    };
};

// export controller
module.exports = selfUpdatePasswordController;