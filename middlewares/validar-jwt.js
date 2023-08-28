const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req,res,next)=>{

    // Leer el Token
    const token = req.header('x-token');
    
    if (!token){
        return res.status(401).json({
            ok : false,
            msg : 'No hay token en la peticion'
        })
    };

    try {
        
        const {uid} = jwt.verify(token,process.env.JWT_SECRET);
        req.uid = uid;
        next();

        
    } catch (error) {
        return res.status(401).json({
            ok : false,
            msg : 'Token no Valido'
        })
        
    }



};

const validarADMIN_ROLE = async (req,res,next) =>{

    try {

        const uid = req.uid;
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok : false,
                msg : 'Usuario no existe'
            })
        };

        if (usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok : false,
                msg : 'Usuario no autorizado'
            })
        };

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok : false,
            msg : 'Hable con el administrador'
        })
        
    }

};


module.exports = {
    validarJWT,
    validarADMIN_ROLE
}

