const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', function(req, res) {


    let start = req.query.start || 0;
    start = Number(start);

    let length = req.query.length || 5;
    length = Number(length);

    if (length === -1) {
        start = 0;
        length = 999999; //Math.max(0, req.param('page'))
    }

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(start)
        .limit(length)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    start,
                    length,
                    collection: 'Usuarios',
                    records: conteo,
                    data: usuarios
                });
            });

        })

});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 16),
        img: body.img,
        role: body.role,
        estado: true,
        google: body.google
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


});

module.exports = app;