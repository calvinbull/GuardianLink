// Connections

function connectionsController(db, logger, propertyLabels) {
    return function(req, res) {
        // authorizationController gatekeeps page to logged in users
        // identify which account types should be displayed
        var accountTypes = [];
        var accountProperties = [];
        if (req.user.accountType == 'super') {  
            accountTypes = ['super','organization', 'volunteer'];
            accountProperties = ['name', 'username', 'email', 'availability', 'backgroundCheck', 'isCurrentlyAvailable', 'linkedin', 'concerns', 'missionStatement']; }
        if (req.user.accountType == 'organization') {  
            accountTypes = ['volunteer']; 
            accountProperties = ['name', 'username', 'email', 'availability', 'backgroundCheck', 'isCurrentlyAvailable', 'linkedin']; }
        if (req.user.accountType == 'volunteer') {  
            accountTypes = ['organization']; 
            accountProperties = ['name', 'username', 'email', 'concerns', 'missionStatement']; }
        
        // dynamically change number of '?'s in sql query to match number of list items
        var accountTypePlaceholders = accountTypes.map(() => '?').join(',');
        var accountPropertiesString = accountProperties.join(',');
        // build sqlite3 query using desired account columns per user type, and add in required number of ? placeholders for type
        var sqlQuery = `SELECT ${accountPropertiesString} FROM users WHERE accountType IN (${accountTypePlaceholders})`;

        // retrieve all desired account types for display
        db.all(sqlQuery, accountTypes, function(err, accounts) {
            if (err) {
                logger.error('Error during db query: ',err);
                return res.status(500).send('Error retrieving accounts');
            }

            // Render the "connections" page and pass the accounts data to the template
            res.render('pages/connections', { pageTitle: 'Connections', currentPage: 'connections', user:req.user, accounts: accounts, propertyLabels: propertyLabels});
        });
    }
}

// export controller
module.exports = connectionsController;