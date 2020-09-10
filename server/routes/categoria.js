const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/auntenticacion');

const app = express();

// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    let start = req.query.start || 0;
    start = Number(start);

    let length = req.query.length || 10;
    length = Number(length);

    if (length === -1) {
        start = 0;
        length = 999999;
    }

    Categoria.find({}, 'descripcion usuario creado')
        .skip(start)
        .limit(length)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    start,
                    length,
                    collection: 'Categorias',
                    records: conteo,
                    data: categorias
                });
            });

        });
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...)
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ============================
// Crear nueva categoria 
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    // regeresa la nueva categoria
    // req.usuario._id

    const { descripcion } = req.body;
    const usuario = req.usuario;

    let categoria = new Categoria({
        descripcion,
        usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Actualiza categoria 
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    const { descripcion } = req.body;

    let modificaCategoria = {
        descripcion
    }

    Categoria.findByIdAndUpdate(id, modificaCategoria, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// ============================
// Elimina categoria por ID
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove(....);

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// let getCategoriaById = (req, res, next) => {

//     const { idCategoria } = req.body;

//     Categoria.findById(idCategoria, (err, categoriaDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }
//         if (!categoriaDB) {
//             return res.status(500).json({
//                 ok: false,
//                 err: {
//                     message: 'Categoria no encontrada'
//                 }
//             });
//         } else {
//             req.categoria = categoriaDB;
//             next();
//         }
//     })

// };

module.exports = app;

//module.exports = getCategoriaById;