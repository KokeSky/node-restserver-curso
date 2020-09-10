const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol '

};

let Schema = mongoose.Schema;

let usuarioEsquema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        //index: true,
        require: [true, 'El email es requerido']
    },
    password: {
        type: String,
        require: [true, 'El password es requerido']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        require: [true, 'El rol es requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        require: [true],
        default: true
    },
    google: {
        type: Boolean,
        require: [true],
        default: false
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});


usuarioEsquema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioEsquema.plugin(uniqueValidator, {
    message: '{PATAH}'
});

module.exports = mongoose.model('Usuario', usuarioEsquema);