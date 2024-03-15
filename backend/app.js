// entry point for server
import express from 'express';
let app = express();

// constants
const HOST = '127.0.0.1';
const PORT = 3000;


// initialize EJS template engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', './backend/views');
// set static asset folder for EJS
app.use(express.static('public'));

// __dirname workaround for ES module
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// route definitions

// default route
app.get('/', (req, res) => {
    res.render('pages/home', { pageTitle: 'Home' });
});



// start server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`)
} );

// kill server
process.on('SIGINT', () => {
    process.exit(0)
    console.log('Server closed')
});// set static asset folder for EJS
app.use(express.static('public'));