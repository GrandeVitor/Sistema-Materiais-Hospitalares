import express from 'express';
import Doacao from '../models/Doacao.js';

const router = express.Router();

// Exibir página de doações
// Exibir página de doações e pesquisar
router.get('/', async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const filtro = busca
            ? {
                $or: [
                    { nomeDoador: { $regex: busca, $options: 'i' } },
                    { nomeMaterial: { $regex: busca, $options: 'i' } }
                ]
            }
            : {};

        const doacoes = await Doacao.find(filtro).sort({ dataDoacao: -1 });

        res.render('doacoes', {
            doacoes,
            busca
        });
    } catch (erro) {
        console.error('Erro ao buscar doações:', erro);
        res.status(500).send('Erro ao carregar as doações.');
    }
});

// Cadastrar doação
router.post('/cadastrar', async (req, res) => {
    try {
        const { nomeDoador, nomeMaterial, quantidade, descricao } = req.body;

        await Doacao.create({
            nomeDoador,
            nomeMaterial,
            quantidade: Number(quantidade),
            descricao
        });

        res.redirect('/doacoes');
    } catch (erro) {
        console.error('Erro ao cadastrar doação:', erro);
        res.status(500).send('Erro ao cadastrar a doação.');
    }
});

// Exibir formulário de edição
router.get('/editar/:id', async (req, res) => {
    try {
        const doacao = await Doacao.findById(req.params.id);

        if (!doacao) {
            return res.status(404).send('Doação não encontrada.');
        }

        res.render('editarDoacao', {
            doacao
        });
    } catch (erro) {
        console.error('Erro ao buscar doação:', erro);
        res.status(500).send('Erro ao carregar a doação.');
    }
});

// Atualizar doação
router.post('/editar/:id', async (req, res) => {
    try {
        const { nomeDoador, nomeMaterial, quantidade, descricao } = req.body;

        await Doacao.findByIdAndUpdate(req.params.id, {
            nomeDoador,
            nomeMaterial,
            quantidade: Number(quantidade),
            descricao
        }, {
            runValidators: true
        });

        res.redirect('/doacoes');
    } catch (erro) {
        console.error('Erro ao atualizar doação:', erro);
        res.status(500).send('Erro ao atualizar a doação.');
    }
});

// Excluir doação
router.post('/excluir/:id', async (req, res) => {
    try {
        const doacao = await Doacao.findByIdAndDelete(req.params.id);

        if (!doacao) {
            return res.status(404).send('Doação não encontrada.');
        }

        res.redirect('/doacoes');
    } catch (erro) {
        console.error('Erro ao excluir doação:', erro);
        res.status(500).send('Erro ao excluir a doação.');
    }
});

export default router;