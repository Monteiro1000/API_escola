const { db } = require('../data/memory-db');

function listar(_req, res) {
  return res.status(200).json(db.cursos);
}

function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const curso = db.cursos.find((item) => item.id === id);

  if (!curso) {
    return res.status(404).json({ mensagem: 'Curso não encontrado.' });
  }

  return res.status(200).json(curso);
}

function criar(req, res) {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: 'Campo obrigatório: nome.' });
  }

  const novoCurso = {
    id: db.cursos.length ? db.cursos[db.cursos.length - 1].id + 1 : 1,
    nome
  };

  db.cursos.push(novoCurso);
  return res.status(201).json(novoCurso);
}

function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome } = req.body;

  const indice = db.cursos.findIndex((item) => item.id === id);
  if (indice === -1) {
    return res.status(404).json({ mensagem: 'Curso não encontrado.' });
  }

  db.cursos[indice] = {
    ...db.cursos[indice],
    nome: nome ?? db.cursos[indice].nome
  };

  return res.status(200).json(db.cursos[indice]);
}

function remover(req, res) {
  const id = Number(req.params.id);
  const indiceCurso = db.cursos.findIndex((item) => item.id === id);

  if (indiceCurso === -1) {
    return res.status(404).json({ mensagem: 'Curso não encontrado.' });
  }

  const possuiAlunos = db.alunos.some((aluno) => aluno.curso_id === id);
  if (possuiAlunos) {
    return res.status(409).json({ mensagem: 'Não é possível remover curso com alunos vinculados.' });
  }

  db.cursos.splice(indiceCurso, 1);
  return res.status(204).send();
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
