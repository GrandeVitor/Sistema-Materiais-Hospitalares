
import mongoose from 'mongoose';

// URI de conexão com o MongoDB Atlas
const URI = 'mongodb+srv://dasilvarodriguesvitor264_db_user:Vitor123@cluster0.awfd40k.mongodb.net/';

async function conectar() {
    try {
        await mongoose.connect(URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (erro) {
        console.error('Erro ao conectar com MongoDB:', erro);
        process.exit(1);
    }
}

export default conectar;
