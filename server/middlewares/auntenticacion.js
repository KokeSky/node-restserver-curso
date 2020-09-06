const jwt = require('jsonwebtoken');


//===============================
// Verificar Token
//===============================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    err,
                    messge: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });


    // res.json({
    //     token
    // });

};

//===============================
// Verificar AdminRole
//===============================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    //console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        //console.log('next()')
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}