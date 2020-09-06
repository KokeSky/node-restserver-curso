const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

//const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', function(req, res) {

    let { email, password } = req.body;

    //console.log(email, password);

    Usuario.findOne({ email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Password incorrecto'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SECRET_KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            logged: true,
            usuario: usuarioDB,
            token
        });
    });

});

module.exports = app;