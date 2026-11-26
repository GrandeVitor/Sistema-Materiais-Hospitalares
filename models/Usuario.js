
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['usuario', 'administrador'],
        default: 'usuario'
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
