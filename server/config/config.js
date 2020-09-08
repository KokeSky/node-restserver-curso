//


//
// Puerto
//
process.env.PORT = process.env.PORT || 5000;


//===============================
// Entorno
//===============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===============================
// Vencimiento el Token
//===============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===============================
// Clave secreta 
//===============================
process.env.SECRET_KEY = process.env.SECRET_KEY || 'este-es-el-seed-desarrollo';


//===============================
// Base de datos
//===============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:masterkey@cluster0.ri7xh.mongodb.net/cafe';
    //urlDB = process.env.MONGOURL_DB;
}

process.env.URLDB = urlDB;


//===============================
// Google Client ID
//===============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '388951770231-et5eq56btbpk3e0tmcqgov2qp2k3jjfp.apps.googleusercontent.com';

//