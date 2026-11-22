const materiaisIniciais = [
  {
    nome: "Cadeira de Rodas",
    descricao: "Auxilia na locomoção de pessoas com mobilidade reduzida.",
    quantidade: 5,
    imagem: "imagens/cadeira.png",
  },
  {
    nome: "Cama Hospitalar",
    descricao: "Cama ajustável para maior conforto do paciente.",
    quantidade: 0,
    imagem: "imagens/cama.png",
  },
  {
    nome: "Muletas",
    descricao: "Suporte para caminhada durante recuperação.",
    quantidade: 8,
    imagem: "imagens/muletas.png",
  },
  {
    nome: "Andador",
    descricao: "Ajuda na locomoção com mais estabilidade.",
    quantidade: 2,
    imagem: "imagens/andador.png",
  },
  {
    nome: "Bengala",
    descricao: "Apoio simples para equilíbrio.",
    quantidade: 0,
    imagem: "imagens/bengala.png",
  },
  {
    nome: "Colchão Pneumático",
    descricao: "Previne escaras em pacientes acamados.",
    quantidade: 3,
    imagem: "imagens/colchao.png",
  },
  {
    nome: "Suporte de Soro",
    descricao: "Para administração intravenosa.",
    quantidade: 7,
    imagem: "imagens/soro.png",
  },
  {
    nome: "Oxímetro de Pulso",
    descricao: "Mede a saturação de oxigênio.",
    quantidade: 10,
    imagem: "imagens/oximetro.png",
  },
];

if (!localStorage.getItem("materiais")) {
  localStorage.setItem("materiais", JSON.stringify(materiaisIniciais));
}
