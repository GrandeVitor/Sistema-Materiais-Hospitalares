
import express from 'express';
import Usuario from '../models/Usuario.js';

const router = express.Router();

// Exibir página de cadastro
router.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

// Cadastrar usuário
router.post('/cadastro', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (!nome || !senha) {
            return res.status(400).send('Preencha todos os campos.');
        }

        const usuarioExistente = await Usuario.findOne({ nome });

        if (usuarioExistente) {
            return res.status(400).send('Este nome já está cadastrado.');
        }

        const novoUsuario = new Usuario({
            nome,
            senha
        });

        await novoUsuario.save();

        res.redirect('/usuarios/login');
    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

// Exibir página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Verificar login
router.post('/login', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        const usuario = await Usuario.findOne({ nome, senha });

if (!usuario) {
    return res.status(401).send('Nome de usuário ou senha incorretos.');
}

// Guardar o usuário na sessão
req.session.usuario = {
    id: usuario._id,
    nome: usuario.nome
};

res.redirect('/solicitacoes');
    } catch (erro) {
        console.error('Erro ao realizar login:', erro);
        res.status(500).send('Erro ao realizar login.');
    }
});

 // Sair da conta
router.get('/logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            console.error('Erro ao encerrar sessão:', erro);
            return res.status(500).send('Erro ao sair da conta.');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});


export default router;
