const User = require('../model/user');
const path = require('path');
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const e = require('express');
const controller = {};



controller.mostrarInicio =  (req,res) => {
    //const pagina = fs.readFileSync(path.join(__dirname, "../views/pages/index.ejs"), "utf8")
    User.obtenerUsuarios(async(err, usuarios) =>{
        if (err) res.status(500).send("Error al obtener usuario");

    //console.log(usuarios);

    const pagina =  await ejs.renderFile("views/pages/index.ejs", {
        usuarios
    });

    res.render("layouts/layouts",{
        titulo : "Inicio",
        body : pagina
    });

    });

}

controller.mostrarContacto = (req,res) => {
    //res.sendFile(path.join(__dirname, '../public/html/contacto.html'));
    const pagina = fs.readFileSync(path.join(__dirname, "../views/pages/contacto.ejs"),"utf8")
    res.render("layouts/layouts", {
        "titulo" : "Contacto",
        body : pagina    
        });
}

// Async: Función asincrona o en paralelo
controller.enviarContacto = async(req, res) => {
    const { name, email, message} = req.body;

    //Construir transportador
    var transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
  }
    });

const mailOptions = {
    from: `${name} - ${email}`,
    to: "vmef1980@gmail.com",
    subject: "Nuevo mensaje de contacto",
    text: `
    Has recibido un nuevo mensaje:
    Nombre: ${name},
    Email: ${email},
    Mensaje: ${message}
    `
    };

    try {
        await transport.sendMail(mailOptions);
        res.redirect("/contacto/enviado");
    } catch (error){
        console.log("Error al enviar mensaje",error);
        res.status(500).send("Error al enviar mensaje");
    }

}

controller.contactoEnviado = (req, res) => {
    const pagina = fs.readFileSync(path.join(__dirname, "../views/pages/contacto_exitoso.ejs"),"utf8")
    res.render("layouts/layouts", {
    "titulo" : "Mensaje Enviado",
    body : pagina    
    });

}

controller.verPefil = (req, res) => {
    //Obtener parametro desde la url
    const id = req.params.id;
    User.obtenerUsuariosPorId(id, async(err, usuario)=>{
        if (err) return res.status(500).send("Error al buscar al usuario");
        if (!usuario){
            return res.status(404).redirect("/error");
        }

        const pagina = await ejs.renderFile("views/pages/perfil.ejs",{  
        usuario
        });
    
        res.render("layouts/layouts", {
        "titulo" : "Perfil de: " + usuario.nombre,
        body : pagina
        });    

    });


}

controller.error_404 = (req, res)  => {
    const pagina = fs.readFileSync(path.join(__dirname, "../views/pages/error_404.ejs"),"utf8")
    res.render("layouts/layouts", {
    "titulo" : "Error 404",
    body : pagina    
    });

}

controller.editarUsuario = async (req, res)  => {
    const id = req.params.id;
    User.obtenerUsuariosPorId(id, async (err, usuario) => {
        if (err) return res.redirect("/error");
        if(!usuario) return res.redirect("/error");
        const pagina = await ejs.renderFile("views/pages/editar.ejs",{
            usuario
    });

        res.render("layouts/layouts", {
            "titulo" : "Editar " + usuario.nombre,
            body : pagina
        });        
    });
}

controller.actualizarUsuario = (req, res) => {
    const id = req.params.id;
    const {name, email} = req.body;


    const base64 = req.file
        ? `data:${req.file.mimetype};base64,${fs.readFileSync(req.file.path, {encoding: "base64"})}` 
        : null; 

    //console.log(id, name, email);

    User.actualizarUsuario(id, 
        { "nombre": name, "correo": email }, base64,
        (err) => {
        if (err) return res.status(404).send("Usuario no encontrado");
        res.redirect(`/usuarios/${id}?updated=true`);
    });
   
}

controller.eliminarUsuario = (req, res) => {
    const id = req.params.id;
    User.eliminarUsuario(id,(err) =>{
        if (err) return res.status(500).send("Error al eliminar usuarios");

        res.redirect(`/?updated=true`);
    });

}

controller.mostrarFormularioNuevo = (req, res)=>{
    const pagina = fs.readFileSync(path.join(__dirname, '../views/pages/nuevo.ejs'), "utf-8");
    res.render("layouts/layouts", {
        titulo: "Nuevo Usuario",
        body: pagina
    });
   
}

controller.crearUsuario = (req, res) =>{
    const {nombre, correo} = req.body;

    if (!nombre || !correo)
        return res.status(400).send("Falatan campos obligatorios");

    const base64 = req.file
    ? `data:${req.file.mimetype};base64,${fs.readFileSync(req.file.path, {encoding: "base64"})}` 
    : null; 

    User.crearUsuario({nombre, correo}, base64, (err,nuevoId) => {
        if(err) return res.status(500).send("Error al crear usuario");

         res.redirect(`/usuarios/${nuevoId}`);
    })

    

   
}

module.exports = controller;