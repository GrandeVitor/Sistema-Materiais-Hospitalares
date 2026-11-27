import express from "express";

import Doacao from "../models/Doacao.js";
import Solicitacao from "../models/Solicitacao.js";
import Emprestimo from "../models/Emprestimo.js";
import Material from "../models/Material.js";
import Usuario from "../models/Usuario.js";
const router = express.Router();

// Exibir painel administrativo
router.get("/", async (req, res) => {
  try {
    const solicitacoesPendentes = await Solicitacao.find({
      status: "Pendente",
    });

    const buscaSolicitacao = req.query.buscaSolicitacao || "";

    const filtroSolicitacao = buscaSolicitacao
      ? {
          $or: [
            { nomeUsuario: { $regex: buscaSolicitacao, $options: "i" } },
            { email: { $regex: buscaSolicitacao, $options: "i" } },
            { nomeMaterial: { $regex: buscaSolicitacao, $options: "i" } },
          ],
        }
      : {};

    const todasSolicitacoes = await Solicitacao.find(filtroSolicitacao).sort({
      dataSolicitacao: -1,
    });
    const solicitacoesComImagem = await Promise.all(
      solicitacoesPendentes.map(async (solicitacao) => {
        const material = await Material.findOne({
          nome: solicitacao.nomeMaterial,
        });

        return {
          ...solicitacao.toObject(),
          imagem: material?.imagem
            ? material.imagem.startsWith("/")
              ? material.imagem
              : `/${material.imagem}`
            : "/imagens/padrao.png",
        };
      }),
    );

    const emprestimosAtivos = await Emprestimo.find({
      status: "Em andamento",
    });

    // Buscar todos os empréstimos
    const buscaEmprestimo = req.query.buscaEmprestimo || "";

    const filtroEmprestimo = buscaEmprestimo
      ? {
          $or: [
            {
              nomeUsuario: {
                $regex: buscaEmprestimo,
                $options: "i",
              },
            },
            {
              nomeMaterial: {
                $regex: buscaEmprestimo,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const todosEmprestimos = await Emprestimo.find(filtroEmprestimo).sort({
      dataEmprestimo: -1,
    });

    const totalMateriais = await Material.countDocuments();

    const buscaUsuario = req.query.buscaUsuario || "";

    const filtroUsuario = buscaUsuario
      ? { nome: { $regex: buscaUsuario, $options: "i" } }
      : {};

    const usuarios = await Usuario.find(filtroUsuario).sort({ nome: 1 });

    const busca = req.query.busca || "";

    const filtro = busca ? { nome: { $regex: busca, $options: "i" } } : {};

    // Buscar e pesquisar doações
    const buscaDoacao = req.query.buscaDoacao || "";

    const filtroDoacao = buscaDoacao
      ? {
          $or: [
            {
              nomeDoador: {
                $regex: buscaDoacao,
                $options: "i",
              },
            },
            {
              nomeMaterial: {
                $regex: buscaDoacao,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const doacoes = await Doacao.find(filtroDoacao).sort({
      dataDoacao: -1,
    });

    const materiais = await Material.find(filtro).sort({ nome: 1 });
    res.render("admin", {
      solicitacoesPendentes: solicitacoesComImagem,
      todasSolicitacoes,
      emprestimosAtivos,
      todosEmprestimos,
      buscaEmprestimo,
      materiais,
      busca,
      doacoes,
      buscaDoacao,
      abaAtiva: req.query.aba || "",
      usuarios,
      buscaUsuario,
      buscaSolicitacao,
      totalPendentes: solicitacoesPendentes.length,
      totalAtivos: emprestimosAtivos.length,
      totalMateriais,
    });
  } catch (erro) {
    console.error("Erro ao carregar painel administrativo:", erro);
    res.status(500).send("Erro ao carregar painel administrativo.");
  }
});

// Aprovar solicitação
router.post("/aprovar/:id", async (req, res) => {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);

    if (!solicitacao) {
      return res.status(404).send("Solicitação não encontrada.");
    }

    if (solicitacao.status !== "Pendente") {
      return res.status(400).send("Esta solicitação já foi processada.");
    }

    const material = await Material.findOne({
      nome: solicitacao.nomeMaterial,
    });

    if (!material) {
      return res.status(404).send("Material não encontrado.");
    }

    const quantidade = solicitacao.quantidade || 1;

    if (material.quantidade < quantidade) {
      return res
        .status(400)
        .send("Não há quantidade suficiente deste material no estoque.");
    }

    // Criar empréstimo
    const novoEmprestimo = new Emprestimo({
      nomeUsuario: solicitacao.nomeUsuario,
      nomeMaterial: solicitacao.nomeMaterial,
      quantidade: quantidade,
    });

    await novoEmprestimo.save();

    // Atualizar estoque
    material.quantidade -= quantidade;
    await material.save();

    // Atualizar status da solicitação
    solicitacao.status = "Aprovada";
    await solicitacao.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao aprovar solicitação:", erro);
    res.status(500).send("Erro ao aprovar solicitação.");
  }
});

// Recusar solicitação
router.post("/recusar/:id", async (req, res) => {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);

    if (!solicitacao) {
      return res.status(404).send("Solicitação não encontrada.");
    }

    if (solicitacao.status !== "Pendente") {
      return res.status(400).send("Esta solicitação já foi processada.");
    }

    solicitacao.status = "Recusada";
    await solicitacao.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao recusar solicitação:", erro);
    res.status(500).send("Erro ao recusar solicitação.");
  }
});

// Registrar devolução
router.post("/devolver/:id", async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).send("Empréstimo não encontrado.");
    }

    if (emprestimo.status !== "Em andamento") {
      return res.status(400).send("Este empréstimo já foi devolvido.");
    }

    const material = await Material.findOne({
      nome: emprestimo.nomeMaterial,
    });

    if (!material) {
      return res.status(404).send("Material não encontrado.");
    }

    // Devolver a quantidade ao estoque
    material.quantidade += emprestimo.quantidade;
    await material.save();

    // Atualizar o status do empréstimo
    emprestimo.status = "Devolvido";
    await emprestimo.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao registrar devolução:", erro);
    res.status(500).send("Erro ao registrar devolução.");
  }
});

// Exibir formulário de edição de solicitação
router.get("/solicitacoes/editar/:id", async (req, res) => {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);

    if (!solicitacao) {
      return res.status(404).send("Solicitação não encontrada.");
    }

    res.render("editarSolicitacao", { solicitacao });
  } catch (erro) {
    console.error("Erro ao buscar solicitação para edição:", erro);
    res.status(500).send("Erro ao carregar formulário de edição.");
  }
});

// Salvar alterações da solicitação
router.post("/solicitacoes/editar/:id", async (req, res) => {
  try {
    const {
      nomeUsuario,
      telefone,
      email,
      rua,
      numero,
      bairro,
      cidade,
      complemento,
    } = req.body;

    const solicitacao = await Solicitacao.findById(req.params.id);

    if (!solicitacao) {
      return res.status(404).send("Solicitação não encontrada.");
    }

    if (
      !nomeUsuario?.trim() ||
      !telefone?.trim() ||
      !email?.trim() ||
      !rua?.trim() ||
      !bairro?.trim() ||
      !cidade?.trim()
    ) {
      return res.status(400).send("Preencha todos os campos obrigatórios.");
    }

    solicitacao.nomeUsuario = nomeUsuario.trim();
    solicitacao.telefone = telefone.trim();
    solicitacao.email = email.trim();

    solicitacao.endereco = {
      rua: rua.trim(),
      numero: numero?.trim() || "",
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      complemento: complemento?.trim() || "",
    };

    await solicitacao.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao editar solicitação:", erro);
    res.status(500).send("Erro ao salvar alterações da solicitação.");
  }
});

// Excluir solicitação
router.post("/solicitacoes/excluir/:id", async (req, res) => {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);

    if (!solicitacao) {
      return res.status(404).send("Solicitação não encontrada.");
    }

    if (solicitacao.status === "Aprovada") {
      return res
        .status(400)
        .send(
          "Não é possível excluir uma solicitação aprovada, pois ela possui um histórico de empréstimo.",
        );
    }

    await Solicitacao.findByIdAndDelete(req.params.id);

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao excluir solicitação:", erro);
    res.status(500).send("Erro ao excluir solicitação.");
  }
});

// Exibir formulário de edição de usuário
router.get("/usuarios/editar/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    res.render("editarUsuario", { usuario });
  } catch (erro) {
    console.error("Erro ao buscar usuário para edição:", erro);
    res.status(500).send("Erro ao carregar formulário de edição.");
  }
});

// Salvar alterações do usuário
router.post("/usuarios/editar/:id", async (req, res) => {
  try {
    const { nome, senha } = req.body;

    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    if (!nome || !nome.trim()) {
      return res.status(400).send("O nome é obrigatório.");
    }

    // Verificar se outro usuário já utiliza esse nome
    const nomeExistente = await Usuario.findOne({
      nome: nome.trim(),
      _id: { $ne: usuario._id },
    });

    if (nomeExistente) {
      return res.status(400).send("Este nome já está cadastrado.");
    }

    usuario.nome = nome.trim();

    // Só altera a senha se o campo não estiver vazio
    if (senha && senha.trim()) {
      usuario.senha = senha;
    }

    await usuario.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao editar usuário:", erro);
    res.status(500).send("Erro ao salvar alterações do usuário.");
  }
});
// Excluir material
router.post("/excluir/:id", async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).send("Material não encontrado.");
    }

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao excluir material:", erro);
    res.status(500).send("Erro ao excluir material.");
  }
});

// Excluir usuário
router.post("/usuarios/excluir/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);
    res.status(500).send("Erro ao excluir usuário.");
  }
});

// Exibir formulário de edição de empréstimo
router.get("/emprestimos/editar/:id", async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).send("Empréstimo não encontrado.");
    }

    res.render("editarEmprestimo", { emprestimo });
  } catch (erro) {
    console.error("Erro ao buscar empréstimo:", erro);
    res.status(500).send("Erro ao carregar formulário de edição.");
  }
});

// Salvar alterações do empréstimo
router.post("/emprestimos/editar/:id", async (req, res) => {
  try {
    const { nomeUsuario, dataEmprestimo } = req.body;

    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).send("Empréstimo não encontrado.");
    }

    if (!nomeUsuario?.trim() || !dataEmprestimo) {
      return res.status(400).send("Preencha todos os campos obrigatórios.");
    }

    const novaData = new Date(`${dataEmprestimo}T12:00:00`);

    if (isNaN(novaData.getTime())) {
      return res.status(400).send("Data do empréstimo inválida.");
    }

    emprestimo.nomeUsuario = nomeUsuario.trim();
    emprestimo.dataEmprestimo = novaData;

    await emprestimo.save();

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao editar empréstimo:", erro);
    res.status(500).send("Erro ao salvar alterações do empréstimo.");
  }
});

// Excluir empréstimo devolvido
router.post("/emprestimos/excluir/:id", async (req, res) => {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);

    if (!emprestimo) {
      return res.status(404).send("Empréstimo não encontrado.");
    }

    if (emprestimo.status !== "Devolvido") {
      return res
        .status(400)
        .send(
          "Não é possível excluir um empréstimo que ainda está em andamento.",
        );
    }

    await Emprestimo.findByIdAndDelete(req.params.id);

    res.redirect("/admin");
  } catch (erro) {
    console.error("Erro ao excluir empréstimo:", erro);
    res.status(500).send("Erro ao excluir empréstimo.");
  }
});

// Cadastrar doação pelo painel administrativo
router.post("/doacoes/cadastrar", async (req, res) => {
  try {
    const { nomeDoador, nomeMaterial, quantidade, descricao } = req.body;

    await Doacao.create({
      nomeDoador,
      nomeMaterial,
      quantidade: Number(quantidade),
      descricao,
    });

    res.redirect("/admin?aba=doacoes");
  } catch (erro) {
    console.error("Erro ao cadastrar doação:", erro);
    res.status(500).send("Erro ao cadastrar a doação.");
  }
});

// Excluir doação pelo painel administrativo
router.post("/doacoes/excluir/:id", async (req, res) => {
  try {
    const doacao = await Doacao.findByIdAndDelete(req.params.id);

    if (!doacao) {
      return res.status(404).send("Doação não encontrada.");
    }

    res.redirect("/admin?aba=doacoes");
  } catch (erro) {
    console.error("Erro ao excluir doação:", erro);
    res.status(500).send("Erro ao excluir a doação.");
  }
});

// Exibir formulário de edição de doação
router.get("/doacoes/editar/:id", async (req, res) => {
  try {
    const doacao = await Doacao.findById(req.params.id);

    if (!doacao) {
      return res.status(404).send("Doação não encontrada.");
    }

    res.render("editarDoacao", { doacao, origemAdmin: true });
  } catch (erro) {
    console.error("Erro ao buscar doação para edição:", erro);
    res.status(500).send("Erro ao carregar formulário de edição.");
  }
});
// Atualizar doação pelo painel administrativo
router.post("/doacoes/editar/:id", async (req, res) => {
  try {
    const { nomeDoador, nomeMaterial, quantidade, descricao } = req.body;

    const doacao = await Doacao.findById(req.params.id);

    if (!doacao) {
      return res.status(404).send("Doação não encontrada.");
    }

    doacao.nomeDoador = nomeDoador;
    doacao.nomeMaterial = nomeMaterial;
    doacao.quantidade = Number(quantidade);
    doacao.descricao = descricao;

    await doacao.save();

    res.redirect("/admin?aba=doacoes");
  } catch (erro) {
    console.error("Erro ao editar doação:", erro);
    res.status(500).send("Erro ao editar a doação.");
  }
});

export default router;
