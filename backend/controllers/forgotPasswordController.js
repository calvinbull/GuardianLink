// controller for /auth/forgotPassword route

// forgotten password initial request

function forgotPasswordController(db, logger, passwordResetToken, transporter) {
    return function(req, res) {
    // pull account info from request
    const { username, email } = req.body;

    // check if unique username / email pair exist
    db.get('SELECT email FROM users WHERE username = ?', [username], (err, dbEmail) => {
        if (err) {
            console.error(err.message);
            logger.error('Error validating password reset request: ', err.message);
        } else {
            if (dbEmail.email == email) {
                // request is valid
                logger.info('Valid password reset initiated.');

                // generate reset email
                // generate a password reset token for email
                const resetToken = passwordResetToken(username);
                // generate expiry time, 10 minutes from now (miliseconds)
                const tokenExpiry = Date.now() + (10 * 60 * 1000);

                // add valid token to password_reset_tokens database for later confirmation
                db.run('INSERT INTO password_reset_tokens (username, token, expiry) VALUES (?, ?, ?)',
                    [username, resetToken, tokenExpiry], (err) => {
                    if (err) {
                        logger.error('Error storing password reset token: ', err);
                        
                    } else {
                        // token stored successfully, proceed with email.
                        // specifiy email options
                        const mailOptions = {
                            from: process.env.EMAIL_ACCOUNT,
                            to: email,
                            subject: `Password Reset Request for ${username}`,
                            text: `Click the following link to reset your password:\nhttps://${process.env.SERVER_HOST}/resetPassword?token=${resetToken}`
                        };

                        // send email via nodemailer
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                logger.error('Error sending email:', err);
                                res.status(500).json({ err: 'Error sending email' });
                            } else {
                                logger.info('Password reset email sent.');
                                // browser alert of success
                                res.json({ message: 'Password reset email sent. Please check your email.' });
                            }
                        });
                    }
                });
                
            } else {
                //request is not valid
                logger.info('Password reset request is unauthorized.');
                res.json({ message: 'Password reset request is unauthorized.' });
            }
        }
    });

};}

// export controller
module.exports = forgotPasswordController;