
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pasta onde as imagens serão armazenadas
const pastaImagens = path.join(__dirname, '../public/imagens');

// Criar a pasta caso ela não exista
if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaImagens);
    },

    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;

        cb(null, nomeArquivo);
    }
});

// Aceitar apenas JPG, PNG e WEBP
const fileFilter = (req, file, cb) => {
    const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
    const extensao = path.extname(file.originalname).toLowerCase();

    if (extensoesPermitidas.includes(extensao)) {
        cb(null, true);
    } else {
        cb(new Error('Formato inválido. Envie uma imagem JPG, PNG ou WEBP.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;
