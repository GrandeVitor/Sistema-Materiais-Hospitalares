
import mongoose from 'mongoose';

const emprestimoSchema = new mongoose.Schema({
    nomeUsuario: {
        type: String,
        required: true
    },
    nomeMaterial: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        default: 1
    },
    dataEmprestimo: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Em andamento', 'Devolvido'],
        default: 'Em andamento'
    }
});

const Emprestimo = mongoose.model('Emprestimo', emprestimoSchema);

export default Emprestimo;
