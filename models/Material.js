
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        default: 0
    },
    categoria: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: false
    }
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
