
import mongoose from 'mongoose';

const doacaoSchema = new mongoose.Schema({
    nomeDoador: {
        type: String,
        required: true
    },
    nomeMaterial: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    descricao: {
        type: String,
        required: false
    },
    dataDoacao: {
        type: Date,
        default: Date.now
    }
});

const Doacao = mongoose.model('Doacao', doacaoSchema);

export default Doacao;
