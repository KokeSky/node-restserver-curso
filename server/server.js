require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();

const bodyParser = require('body-parser');
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

console.log(`Conectando a :${process.env.URLDB}`.yellow);

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE'.green);
    });

// await mongoose.connect('mongodb://localhost:27017/cafe', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// });

app.listen(port, () => {
    console.log(`Escuchando puerto ${ port }`);
});