
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
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).send('Preencha todos os campos.');
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Verificar se o nome já está cadastrado
        const usuarioExistente = await Usuario.findOne({ nome });

        if (usuarioExistente) {
            return res.status(400).send('Este nome já está cadastrado.');
        }

        // Verificar se o e-mail já está cadastrado
        const emailExistente = await Usuario.findOne({
            email: emailNormalizado
        });

        if (emailExistente) {
            return res.status(400).send('Este e-mail já está cadastrado.');
        }

        // Criar novo usuário
        const novoUsuario = new Usuario({
            nome,
            email: emailNormalizado,
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

        const usuario = await Usuario.findOne({
            nome,
            senha
        });

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Nome de usuário ou senha incorretos!'
            });
        }

        req.session.usuario = {
            id: usuario._id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({
            sucesso: true,
            redirecionar: '/'
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao tentar fazer login.'
        });
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
