
import mongoose from 'mongoose';

const solicitacaoSchema = new mongoose.Schema({
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
    dataSolicitacao: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pendente', 'Aprovada', 'Recusada'],
        default: 'Pendente'
    }
});

const Solicitacao = mongoose.model('Solicitacao', solicitacaoSchema);

export default Solicitacao;
