// entry point for server

import express from 'express';
let app = express();

// initialize EJS template engine
app.set('view engine', 'ejs');

// __dirname workaround for ES module
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// route definitions

// default route
app.get('/', (req, res) => {
    res.render('home', { pageTitle: 'Guardian Link' });
});



// set static asset folder for EJS
app.use(express.static('public'));

// start server
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
} );

// kill server
process.on('SIGINT', () => {
    process.exit(0)
    console.log('Server closed')
});