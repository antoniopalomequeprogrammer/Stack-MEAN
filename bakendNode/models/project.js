'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    name: String,
    description:String,
    category:String,
    year:Number,
    langs: String,
    image:String,

});

// Definir primer parametro en Mayuscula y singular, mongo despues se encargara de 
// ponerlo en la base de datos en plural y minúscula.

module.exports = mongoose.model('Project',ProjectSchema);
// projects --> guarda los documents en la colección