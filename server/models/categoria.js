const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaEsquema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

categoriaEsquema.plugin(uniqueValidator, {
    message: '{PATAH}'
});

module.exports = mongoose.model('Categoria', categoriaEsquema);