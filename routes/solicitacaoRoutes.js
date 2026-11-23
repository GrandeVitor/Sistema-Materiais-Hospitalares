
import express from 'express';
import Solicitacao from '../models/Solicitacao.js';
import Material from '../models/Material.js';

const router = express.Router();

// Exibir página de solicitações
router.get('/', (req, res) => {
    res.render('solicitacoes', {
        solicitacoes: [],
        email: '',
        pesquisou: false
    });
});

// Consultar solicitações pelo e-mail
router.post('/buscar', async (req, res) => {
    try {
        const email = req.body.email.trim();

        const resultados = await Solicitacao.find({
            email: { $regex: `^${email}$`, $options: 'i' }
        });

        const solicitacoes = await Promise.all(
            resultados.map(async (solicitacao) => {
                const material = await Material.findOne({
                    nome: solicitacao.nomeMaterial
                });

                return {
                    ...solicitacao.toObject(),
                    material: solicitacao.nomeMaterial,
                    imagem: material?.imagem
    ? material.imagem.startsWith('/')
        ? material.imagem
        : `/${material.imagem}`
    : '/imagens/padrao.png'
                };
            })
        );

        res.render('solicitacoes', {
            solicitacoes,
            email,
            pesquisou: true
        });

    } catch (erro) {
        console.error('Erro ao consultar solicitações:', erro);
        res.status(500).send('Erro ao consultar solicitações.');
    }
});

// Cadastrar solicitação
router.post('/cadastrar', async (req, res) => {
    try {
        const novaSolicitacao = new Solicitacao({
            nomeUsuario: req.body.nome,
            telefone: req.body.telefone,
            email: req.body.email,
            endereco: {
                rua: req.body.rua,
                numero: req.body.numero,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                complemento: req.body.complemento
            },
            nomeMaterial: req.body.material,
            quantidade: 1
        });

        await novaSolicitacao.save();

        res.redirect('/solicitacoes');

    } catch (erro) {
        console.error('Erro ao cadastrar solicitação:', erro);
        res.status(500).send('Erro ao cadastrar solicitação.');
    }
});

export default router;
