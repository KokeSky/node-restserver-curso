const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/auntenticacion');

const app = express();


// function getNoImage(res) {
//     let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
//     return res.sendFile(pathNoImage);
// }

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    const { tipo, img } = req.params;

    // //Validar tipo
    // let tiposValidos = ['usuarios', 'productos'];
    // if (tiposValidos.indexOf(tipo) < 0) {
    //     return res.status(400)
    //         .json({
    //             ok: false,
    //             err: {
    //                 message: 'Los tipos permitidas son ' + tiposValidos.join(' '),
    //                 tipo
    //             }
    //         });
    // }

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathNoImage);
    }

    //return getNoImage(res);
    // let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
    // res.sendFile(pathNoImage);
});


module.exports = app;