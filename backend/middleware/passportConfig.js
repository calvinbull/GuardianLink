module.exports = function(passport, db) {

    // imports
    const LocalStrategy = require('passport-local').Strategy;
    // initialize bcrypt for hashing
    const bcrypt = require('bcrypt');
    const saltRounds = 10; // salt rounds used for hashing

    // configure passport
    passport.use(new LocalStrategy(
        function verify(username, password, cb) {
            // sqlite3 query to find expected password based on unique username
            db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
                // catch errors
                if (err) { return cb(err); }
                if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
               
                // bcrypt to compare given password against db
                const passwordMatch = bcrypt.compareSync(password, user.password);

                if (passwordMatch) {
                    // password matches expected from database
                    // return user information in callback (cb) function
                    cb(null, user);

                } else {
                    // bad password
                    // return false return with cb
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
            });
        }
    ));

    // passport method to add user identifier to session
    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            cb(null, user);
        });    
    });
    
    // passport method to fetch full user object
    passport.deserializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });    
    });

}
