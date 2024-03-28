 // controller for /auth/newPassword route

// password reset
function newPasswordController(db, logger) { 
    return function (req, res) {
        // pull token and new password from session
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required.' });
        }

        // verify if token exists and is still valid
        const currentTime = Date.now();
        db.get('SELECT username,expiry FROM password_reset_tokens WHERE token = ?', [token], (err, row) => {
            if (err) {
                logger.error('Error during token lookup: ', err);
                res.json({ message: 'Error during token lookup.' });        
            } else { 
                if (row.expiry >= currentTime) {
                    // token is still valid, proceed to update password.
                    db.run(`UPDATE users SET password = ? WHERE username = ?`, 
                            [ bcrypt.hashSync(password, saltRounds), row.username ], (err) => {
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
                } else {
                    // token is expired
                    logger.info('Password reset request is expired.');
                    res.json({ message: 'Password reset request is expired.' });

                }
            }
        });
    };
};

// export controller
module.exports = newPasswordController;