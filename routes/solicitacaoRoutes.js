import express from "express";
import Solicitacao from "../models/Solicitacao.js";
import Material from "../models/Material.js";

const router = express.Router();

// Buscar solicitações pelo e-mail
async function buscarSolicitacoes(email) {
  const resultados = await Solicitacao.find({
    email: { $regex: `^${email}$`, $options: "i" },
  });

  return await Promise.all(
    resultados.map(async (solicitacao) => {
      const material = await Material.findOne({
        nome: solicitacao.nomeMaterial,
      });

      return {
        ...solicitacao.toObject(),
        material: solicitacao.nomeMaterial,
        imagem: material?.imagem
          ? material.imagem.startsWith("/")
            ? material.imagem
            : `/${material.imagem}`
          : "/imagens/padrao.png",
      };
    }),
  );
}

// Exibir página de solicitações
router.get("/", async (req, res) => {
  try {
    // Se estiver logado, consultar automaticamente pelo e-mail da conta
    if (req.session.usuario?.email) {
      const email = req.session.usuario.email;
      const solicitacoes = await buscarSolicitacoes(email);

      return res.render("solicitacoes", {
        solicitacoes,
        email,
        pesquisou: true,
        usuarioLogado: req.session.usuario,
      });
    }

    // Se não estiver logado, exibir consulta manual
    res.render("solicitacoes", {
      solicitacoes: [],
      email: "",
      pesquisou: false,
      usuarioLogado: false,
    });
  } catch (erro) {
    console.error("Erro ao carregar solicitações:", erro);
    res.status(500).send("Erro ao carregar solicitações.");
  }
});

// Consultar solicitações pelo e-mail (para quem não está logado)
router.post("/buscar", async (req, res) => {
  try {
    // Se estiver logado, usar o e-mail da sessão
    const email = req.session.usuario?.email || req.body.email?.trim();

    if (!email) {
      return res.status(400).send("Informe um e-mail para consultar.");
    }

    const solicitacoes = await buscarSolicitacoes(email);

    res.render("solicitacoes", {
      solicitacoes,
      email,
      pesquisou: true,
      usuarioLogado: req.session.usuario || false,
    });
  } catch (erro) {
    console.error("Erro ao consultar solicitações:", erro);
    res.status(500).send("Erro ao consultar solicitações.");
  }
});

// Cadastrar solicitação
router.post("/cadastrar", async (req, res) => {
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
        complemento: req.body.complemento,
      },
      nomeMaterial: req.body.material,
      quantidade: 1,
    });

    await novaSolicitacao.save();

    res.redirect("/solicitacoes");
  } catch (erro) {
    console.error("Erro ao cadastrar solicitação:", erro);
    res.status(500).send("Erro ao cadastrar solicitação.");
  }
});

export default router;
