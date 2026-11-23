
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import conectar from './config/conexao.js';
import solicitacaoRoutes from './routes/solicitacaoRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import doacaoRoutes from './routes/doacaoRoutes.js';
import Material from './models/Material.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão com MongoDB
conectar();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos públicos
app.use(express.static(path.join(__dirname, 'public')));

// Recebimento de formulários
app.use(express.urlencoded({ extended: true }));

// Registro das rotas
app.use('/materiais', materialRoutes);
app.use('/solicitacoes', solicitacaoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/doacoes', doacaoRoutes);

// Rotas das páginas
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/admin', adminRoutes);

app.get('/solicitar', async (req, res) => {
    try {
        const materiais = await Material.find({
            quantidade: { $gt: 0 }
        });

        const materialSelecionado = req.query.material || '';

        res.render('solicitar', {
            materiais,
            materialSelecionado
        });
    } catch (erro) {
        console.error('Erro ao buscar materiais:', erro);
        res.status(500).send('Erro ao carregar o formulário.');
    }
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
