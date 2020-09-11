const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const { exists } = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    const { tipo, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo '
                }
            });
    }

    //Validar tipo
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidas son ' + tiposValidos.join(' '),
                    tipo
                }
            });

    }

    let archivo = req.files.archivo;

    let nombresArchivo = archivo.name.split('.');
    let extension = nombresArchivo[nombresArchivo.length - 1];

    // Extenciones permtidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(' '),
                    ext: extension
                }
            });
    }


    // Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        // aqui imagen ya cargada

        switch (tipo) {
            case 'usuarios':
                return imagenUsuario(res, tipo, id, nombreArchivo)
                break;
            case 'productos':
                return imagenProducto(res, tipo, id, nombreArchivo)
                break;
            default:
                break;
        }
        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    });

});

function borraImagen(tipo, nombreImagen) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function imagenUsuario(res, tipo, id, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraImagen(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraImagen(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borraImagen(tipo, usuarioDB.img);
        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);

        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        })
    })

    // let usuarioModifica = {
    //     img: nombreArchivo
    // };

    // Usuario.findByIdAndUpdate(id, usuarioModifica, { new: true, runValidators: true }, (err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     return res.json({
    //         ok: true,
    //         usuario: usuarioDB,
    //         img: nombreArchivo
    //     });
    // })
};

function imagenProducto(res, tipo, id, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraImagen(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraImagen(tipo, nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        borraImagen(tipo, productoDB.img);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        })
    })


    // let modificarProducto = {
    //     img: nombreArchivo
    // };

    // console.log(modificarProducto);

    // Producto.findByIdAndUpdate(id, modificarProducto, { new: true }, (err, productoDB) => {
    //     //Producto.findByIdAndUpdate(id, modificarProducto, { new: true, runValidators: true }, (err, productoDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             productoDB,
    //             err: {
    //                 message: 'Producto no encontrado'
    //             }
    //         });
    //     }
    //     return res.json({
    //         ok: true,
    //         producto: productoDB,
    //         img: nombreArchivo
    //     });
    // })
};


module.exports = app;
module.exports = app;