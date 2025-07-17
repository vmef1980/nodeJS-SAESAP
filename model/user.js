const fs = require("fs");
const { console } = require("inspector");
const path = require("path");
const route = path.join(__dirname, "../database/users.json");
const db = require("../config/db");

const rutaFotos = path.join(__dirname, "../database/fotos.json")

const User = {
obtenerUsuarios: (callback) => {
        db.query("Select * from usuarios", (err, results) => {
            if (err) return callback(err);
            
            const fotos = User._leerFotos();
            const usuarios = results.map(user => ({
                ...user,
                foto: fotos[user.id] || null
            }));
            //console.log(usuarios);

            callback(null, usuarios);
        })    
        /*const usuarios = fs.readFileSync(route, "utf8");
        return JSON.parse(usuarios);*/
},

obtenerUsuariosPorId: (id, callback) => {
    db.query("select * from usuarios where id = ?",[id],(err, results)=>{
        if (err) return callback(err);

        if (results.length === 0) return callback(null, null);

        const user = results[0];
        const fotos = User._leerFotos();
        user.foto = fotos[user.id] || null;
        callback(null, user);
    })
},

eliminarUsuario: (id, callback) => {

    db.query("DELETE FROM usuarios WHERE id =?", [id], (err) => {
        if (err) return callback(err);
        User._eliminarFoto(id);
        callback(null);
    });
},

crearUsuario:(datos, base64, callback) =>{
    db.query("INSERT INTO usuarios (nombre, correo) VALUES (?,?)",
    [datos.nombre, datos.correo],
    (err, result) => {
        if(err) return callback(err);
        if (base64) User._guardarFoto(result.insertId, base64);
        callback(null, result.insertId);
    }
);
},

actualizarUsuario : (id, nuevosDatos, base64, callback) => {
        db.query('UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
            [nuevosDatos.nombre, nuevosDatos.correo, id],
            (err) => {
            if (err) return callback(err);
            if (base64) User._guardarFoto(id, base64);
            callback(null);
            }
        );
},


// Métodos    
    _leerFotos: () => {
        try {
            return JSON.parse(fs.readFileSync(rutaFotos, "utf-8"));
        } catch (error) {
        return {};
        }
    
    },

    _guardarFoto: (id, base64) => {
        const fotos = User._leerFotos();
        fotos[id] = base64;
        fs.writeFileSync(rutaFotos, JSON.stringify(fotos, null, 2));
    },

    _eliminarFoto: (id) => {
        const fotos = User._leerFotos();
        delete fotos[id];
        fs.writeFileSync(rutaFotos, JSON.stringify(fotos, null, 2));
    }

}

module.exports = User;