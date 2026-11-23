import express from 'express';
import Material from '../models/Material.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const materiais = await Material.find();
        res.render('materiais', { materiais });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar materiais.');
    }
});

router.post('/cadastrar', async (req, res) => {
    try {
        const novoMaterial = new Material({
            nome: req.body.nome,
            descricao: req.body.descricao,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria,
            imagem: req.body.imagem
        });

        await novoMaterial.save();

        res.redirect('/materiais');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar material.');
    }
});

// Abrir formulário de edição
router.get('/editar/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).send('Material não encontrado.');
        }

        res.render('editarMaterial', { material });

    } catch (erro) {
        console.error('Erro ao buscar material:', erro);
        res.status(500).send('Erro ao carregar formulário de edição.');
    }
});

// Atualizar material
router.post('/editar/:id', async (req, res) => {
    try {
        await Material.findByIdAndUpdate(req.params.id, {
            nome: req.body.nome,
            descricao: req.body.descricao,
            quantidade: req.body.quantidade,
            categoria: req.body.categoria,
            imagem: req.body.imagem
        });

        res.redirect('/materiais');

    } catch (erro) {
        console.error('Erro ao atualizar material:', erro);
        res.status(500).send('Erro ao atualizar material.');
    }
});

export default router;