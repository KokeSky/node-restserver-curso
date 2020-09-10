const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Categoria = require('../models/categoria');

const Producto = require('../models/producto');

const { verificaToken, verificaAdminRole } = require('../middlewares/auntenticacion');
//const { getCategoriaById } = require('../routes/categoria');

const app = express();

// ============================
// Obtener todos los Productos
// ============================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado 

    let start = req.query.start || 0;
    start = Number(start);

    let length = req.query.length || 10;
    length = Number(length);

    if (length === -1) {
        start = 0;
        length = Number.MAX_SAFE_INTEGER;
    }

    Producto.find({ disponible: true }, 'nombre precioUni descripcion disponible categoria usuario creado')
        .skip(start)
        .limit(length)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    start,
                    length,
                    collection: 'Productos',
                    records: conteo,
                    data: productos
                });
            });

        });
    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.get('/producto', verificaToken, (req, res) => {`
    //     }
    // });
});


// ============================
// Mostrar un Producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    const id = req.params.id;

    Producto.findById(id, 'nombre precioUni descripcion disponible categoria usuario creado')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.get('/producto/:id', verificaToken, (req, res) => {`
    //     }
    // });
});

// ============================
// Obtener todos los Productos
// ============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let busqueda = {
        nombre: new RegExp(termino, 'i')
    };

    Producto.find(busqueda)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments(busqueda, (err, conteo) => {

                res.json({
                    ok: true,
                    //start,
                    //length,
                    collection: 'Productos',
                    records: conteo,
                    data: productos
                });
            });

        });


    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.get('/producto/buscar/:termino', verificaToken, (req, res) => {`
    //     }
    // });
});

let getCategoriaById = (req, res, next) => {

    const { idCategoria } = req.body;

    if (idCategoria === undefined) {
        req.categoria = null;
        next();
        return;
    }

    Categoria.findById(idCategoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
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
        } else {
            req.categoria = categoriaDB;
            next();
        }
    });
};

// ============================
// Crear nuevo Producto 
// ============================
app.post('/producto', [verificaToken, getCategoriaById], (req, res) => {

    const { nombre, precioUni, descripcion } = req.body;
    const usuario = req.usuario;
    const categoria = req.categoria;

    let producto = new Producto({
        nombre: nombre.trim(),
        precioUni: Number(precioUni),
        descripcion: descripcion.trim(),
        categoria,
        usuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.post('/producto', verificaToken, (req, res) => {`
    //     }
    // });
});


// ============================
// Actualiza Producto 
// ============================
app.put('/producto/:id', [verificaToken, getCategoriaById], (req, res) => {
    const id = req.params.id;

    const { nombre, precioUni, descripcion, disponible } = req.body;

    const categoria = req.categoria;

    let modificarProducto = {};

    if (nombre) modificarProducto.nombre = nombre.trim();

    if (precioUni) modificarProducto.precioUni = Number(precioUni);

    if (descripcion) modificarProducto.descripcion = descripcion.trim();

    if (disponible) modificarProducto.disponible = disponible;

    if (categoria) modificarProducto.categoria = categoria;

    Producto.findByIdAndUpdate(id, modificarProducto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        });
    });
    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.put('/producto/:id', verificaToken, (req, res) => {`
    //     }
    // });
});


// ============================
// Elimina Producto por ID 
// ============================
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // disponible false
    const id = req.params.id;

    let modificarProducto = new Producto({
        disponible: false
    });

    Producto.findByIdAndUpdate(id, modificarProducto, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        });
    });


    // res.json({
    //     ok: false,
    //     err: {
    //         todo: 'Implementar ',
    //         message: `app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {`
    //     }
    // });

});

module.exports = app;