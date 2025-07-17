// Requerimos el modulo de Express
const express = require('express');
const router = express.Router(); // Clase estática Router de Express
const controller = require('../controller/controller');
const upload = require('../middleware/multer.config');

router.get('/' , controller.mostrarInicio);
router.get('/contacto' , controller.mostrarContacto);
router.post('/contacto', controller.enviarContacto);
router.get('/contacto/enviado' , controller.contactoEnviado);
router.get('/usuarios/:id', controller.verPefil);
router.get('/error', controller.error_404);
router.get('/usuarios/:id/editar', controller.editarUsuario);
router.post('/usuarios/:id/eliminar', controller.eliminarUsuario);
router.get('/usuario/nuevo', controller.mostrarFormularioNuevo);

router.post('/usuario/nuevo', (req, res, next) => {
    upload.single("foto")(req, res, function(err){
        if(err){
            return res.status(400).render("layouts/layouts", {
                titulo: "Error al subir la imagen", 
                body:   `<div class="notification is-danger is-light">
                        <strong>Error: </strong> ${err.message}
                        <a href="/" class="button is-link mt-3">
                        Volver
                        </a>
                        </div>`
            });
        }
        next();
    });
}, controller.crearUsuario);

  
router.post('/usuarios/:id/editar', (req, res, next) => {
    upload.single("foto")(req, res, function(err){
        if(err){
            return res.status(400).render("layouts/layouts", {
                titulo: "Error al subir la imagen", 
                body:   `<div class="notification is-danger is-light">
                        <strong>Error: </strong> ${err.message}
                        <a href="/" class="button is-link mt-3">
                        Volver
                        </a>
                        </div>`
        });
        }
        next();
    })
} , controller.actualizarUsuario);

module.exports = router; 