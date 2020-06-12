const express = require('express');
const app = express();

app.use(express.static('./public'));

app.get('/ctrl', (req, res) => {
    res.redirect('https://esthermerinero.dreamhosters.com/wp-admin');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 8080, () => console.log(`initializing_esther_merinero...`));
