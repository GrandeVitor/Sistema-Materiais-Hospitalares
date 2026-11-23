
import express from 'express';

import Solicitacao from '../models/Solicitacao.js';
import Emprestimo from '../models/Emprestimo.js';
import Material from '../models/Material.js';

const router = express.Router();

// Exibir painel administrativo
router.get('/', async (req, res) => {
    try {
        const solicitacoesPendentes = await Solicitacao.find({
            status: 'Pendente'
        });

        const solicitacoesComImagem = await Promise.all(
            solicitacoesPendentes.map(async (solicitacao) => {
                const material = await Material.findOne({
                    nome: solicitacao.nomeMaterial
                });

                return {
                    ...solicitacao.toObject(),
                    imagem: material?.imagem
                        ? material.imagem.startsWith('/')
                            ? material.imagem
                            : `/${material.imagem}`
                        : '/imagens/padrao.png'
                };
            })
        );

        const emprestimosAtivos = await Emprestimo.find({
            status: 'Em andamento'
        });

        const totalMateriais = await Material.countDocuments();

const busca = req.query.busca || '';

const filtro = busca
    ? { nome: { $regex: busca, $options: 'i' } }
    : {};

const materiais = await Material.find(filtro).sort({ nome: 1 });
        res.render('admin', {
            solicitacoesPendentes: solicitacoesComImagem,
            emprestimosAtivos,
            materiais,
            busca,
            totalPendentes: solicitacoesPendentes.length,
            totalAtivos: emprestimosAtivos.length,
            totalMateriais
        });

    } catch (erro) {
        console.error('Erro ao carregar painel administrativo:', erro);
        res.status(500).send('Erro ao carregar painel administrativo.');
    }
});

// Aprovar solicitação
router.post('/aprovar/:id', async (req, res) => {
    try {
        const solicitacao = await Solicitacao.findById(req.params.id);

        if (!solicitacao) {
            return res.status(404).send('Solicitação não encontrada.');
        }

        if (solicitacao.status !== 'Pendente') {
            return res.status(400).send('Esta solicitação já foi processada.');
        }

        const material = await Material.findOne({
            nome: solicitacao.nomeMaterial
        });

        if (!material) {
            return res.status(404).send('Material não encontrado.');
        }

        const quantidade = solicitacao.quantidade || 1;

        if (material.quantidade < quantidade) {
            return res.status(400).send('Não há quantidade suficiente deste material no estoque.');
        }

        // Criar empréstimo
        const novoEmprestimo = new Emprestimo({
            nomeUsuario: solicitacao.nomeUsuario,
            nomeMaterial: solicitacao.nomeMaterial,
            quantidade: quantidade
        });

        await novoEmprestimo.save();

        // Atualizar estoque
        material.quantidade -= quantidade;
        await material.save();

        // Atualizar status da solicitação
        solicitacao.status = 'Aprovada';
        await solicitacao.save();

        res.redirect('/admin');

    } catch (erro) {
        console.error('Erro ao aprovar solicitação:', erro);
        res.status(500).send('Erro ao aprovar solicitação.');
    }
});


// Recusar solicitação
router.post('/recusar/:id', async (req, res) => {
    try {
        const solicitacao = await Solicitacao.findById(req.params.id);

        if (!solicitacao) {
            return res.status(404).send('Solicitação não encontrada.');
        }

        if (solicitacao.status !== 'Pendente') {
            return res.status(400).send('Esta solicitação já foi processada.');
        }

        solicitacao.status = 'Recusada';
        await solicitacao.save();

        res.redirect('/admin');

    } catch (erro) {
        console.error('Erro ao recusar solicitação:', erro);
        res.status(500).send('Erro ao recusar solicitação.');
    }
});


// Registrar devolução
router.post('/devolver/:id', async (req, res) => {
    try {
        const emprestimo = await Emprestimo.findById(req.params.id);

        if (!emprestimo) {
            return res.status(404).send('Empréstimo não encontrado.');
        }

        if (emprestimo.status !== 'Em andamento') {
            return res.status(400).send('Este empréstimo já foi devolvido.');
        }

        const material = await Material.findOne({
            nome: emprestimo.nomeMaterial
        });

        if (!material) {
            return res.status(404).send('Material não encontrado.');
        }

        // Devolver a quantidade ao estoque
        material.quantidade += emprestimo.quantidade;
        await material.save();

        // Atualizar o status do empréstimo
        emprestimo.status = 'Devolvido';
        await emprestimo.save();

        res.redirect('/admin');

    } catch (erro) {
        console.error('Erro ao registrar devolução:', erro);
        res.status(500).send('Erro ao registrar devolução.');
    }
});

// Excluir material
router.post('/excluir/:id', async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);

        if (!material) {
            return res.status(404).send('Material não encontrado.');
        }

        res.redirect('/admin');

    } catch (erro) {
        console.error('Erro ao excluir material:', erro);
        res.status(500).send('Erro ao excluir material.');
    }
});

export default router;
