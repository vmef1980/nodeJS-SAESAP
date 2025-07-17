
// Requerimos el modulo de express
const express = require("express");

// Inicializamos a Express
const app = express();

// Buscamos puerto disponible
const PORT = 3000;
// 127.0.0.1

const path = require("path");

require("dotenv").config(); //Configuración cargar variables de entorno.

// Middleware: Configuración previa para que funcione el servidor
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ // Para leer los datos del formulario
    extended: true
}));

// Middleware: Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Enrutador
const mainRoutes=require("./routes/router");
app.use("/",mainRoutes);

// Inicializamos el servidor web
app.listen(PORT, function() {
    console.log("Server on port ",PORT);
});