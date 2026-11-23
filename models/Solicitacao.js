
import mongoose from 'mongoose';

const solicitacaoSchema = new mongoose.Schema({
    nomeUsuario: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    endereco: {
        rua: {
            type: String,
            required: true
        },
        numero: {
            type: String
        },
        bairro: {
            type: String,
            required: true
        },
        cidade: {
            type: String,
            required: true
        },
        complemento: {
            type: String
        }
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
