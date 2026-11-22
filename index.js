
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos públicos
app.use(express.static(path.join(__dirname, 'public')));

// Recebimento de formulários
app.use(express.urlencoded({ extended: true }));

// Rotas das páginas
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/materiais', (req, res) => {
    res.render('materiais');
});

app.get('/solicitacoes', (req, res) => {
    res.render('solicitacoes');
});

app.get('/solicitar', (req, res) => {
    res.render('solicitar');
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
