'use strict'

// Conectar node con mongo

var mongoose = require('mongoose');
var app = require('./app');
var port = 3700;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
        .then(()=>{
            console.log("Conexión a la base de datos establecida con éxito...");
            // Creación del servidor
            app.listen(port, () =>{
                console.log("La conexión se ha realizado correctamente en la url: localhost:3700");
            });
        })
        .catch(error => {
            console.log(error);
        })


