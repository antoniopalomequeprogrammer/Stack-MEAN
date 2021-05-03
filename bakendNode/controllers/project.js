'use strict'

const project = require('../models/project');
// Importar modelo

var Project = require('../models/project');

var fs = require('fs');

var path = require('path');

var controller = {

    home:function(req,res){
        return res.status(200).send({
            message: 'Soy la home'
        })
    },

    test:function(req, res){
        return res.status(200).send({
            message: 'Soy el metodo o acción test del controlador de proyectos'
        })

    },

    saveProject:function(req,res){
        var project = new Project();

        var params = req.body;     
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;
        // project.save();

        // // console.log(project.save());

        // if(project.save(err,projectStored)){
        //     return res.status(200).send({message: 'true'});
        // }
        // else{
        //     return res.status(500).send({message: 'false'})
        // }

        


        project.save((err,projectStored) =>{
            if(err) return res.status(500).send({message: 'Error al guardar'})

            if(projectStored) return res.status(200).send({project:project,message:"Metodo saveProject"})
            
            
            if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto'})

            // return res.status(200).send({project : projectStored});

            });

            // return res.status(200).send({
            //     project:project,
            //     message: "Metodo saveProject"
            // });
    },

    getProject:function(req,res){

        var projectId = req.params.id;

        Project.findById(projectId, (error,project)=>{

            if(error) return res.status(500).send({
                message: "Error al devolver los datos."
            })

            if(!project) return res.status(404).send({
                message: "El proyecto no existe."
            })

            return res.status(200).send({
                project
            })

        });



    },

    getProjects:function(req,res){


        // Project.find({year:2019}) --> Lo que esta dentro de los corchetes 
        //actuaria como un where, en este caso me sacaria los proyectos del año 2019

        Project.find({}).sort('year').exec((err,projects) =>{
            if(err) return res.status(500).send({message: 'Error al devolver los datos'})
            if(!projects) return res.status(404).send({message: 'No hay projectos para mostrar'});

            return res.status(200).send({projects});
        });

    },

    updateProject:function(req,res){
        var projectId = req.params.id;
        var update = req.body;
// Ponemos {new:true} para que nos devuelva los datos nuevos
        Project.findByIdAndUpdate(projectId, update,{new:true}, (err,projectUpdated) =>{
            if(err) return res.status(500).send({message:'Error al actualizar'});
            if(!projectUpdated) return res.status(404).send({message: 'No existe el proyecto'});

            return res.status(200).send({
                project: projectUpdated
            });
        })
    },

    deleteProject:function(req,res){
        var projectId = req.params.id;

        Project.findOneAndDelete(projectId, (err,projectRemoved) =>{

            if(err) return res.status(500).send({message:"No se ha podido borrar el documento"});
            if(!projectRemoved) return res.status(404).send({message:'No se puede eliminar ese projecto'});
            return res.status(200).send({project: projectRemoved})

        });
    },

    uploadImage : function(req,res){

        var projectId = req.params.id;

        var fileName = 'Imagen no subida...';
        // Para recoger ficheros
        
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var exSplit = fileName.split('\.');
            var fileExt = exSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){

                Project.findByIdAndUpdate(projectId,{image:fileName}, {new:true}, (error,projectUpdated) =>{

                    if(error) return res.status(500).send({message: 'La imagen no se ha subido'});
    
                    if(!projectUpdated) return res.status(404).send({message: 'El proyecto no existe'});
    
                    return res.status(200).send({project:projectUpdated})
    
                })


            }else{

                fs.unlink(filePath,(error)=>{
                    return res.status(200).send({
                        message: "La extensión no es valida"
                    });
                })

            }

            

        }else{
            return res.status(200).send({
                message: fileName
            })
        }

    },

    getImageFile : function(req,res){
        var file = req.params.image;
        var path_file = './uploads/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }
            else{
                return res.status(200).send({
                    message: "No existe la imagen..."
                });
            }

        });
    }




};

module.exports = controller;