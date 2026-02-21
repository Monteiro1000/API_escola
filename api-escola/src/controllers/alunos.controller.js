const { db } = require('../data/memory-db');

function listar(_req, res) {
  return res.status(200).json(db.alunos);
}

function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const aluno = db.alunos.find((item) => item.id === id);

  if (!aluno) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  return res.status(200).json(aluno);
}

function criar(req, res) {
  const { nome, email, curso_id } = req.body;

  if (!nome || !email || !curso_id) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, email, curso_id.' });
  }

  const cursoExiste = db.cursos.some((curso) => curso.id === Number(curso_id));
  if (!cursoExiste) {
    return res.status(400).json({ mensagem: 'curso_id inválido.' });
  }

  const novoAluno = {
    id: db.alunos.length ? db.alunos[db.alunos.length - 1].id + 1 : 1,
    nome,
    email,
    curso_id: Number(curso_id)
  };

  db.alunos.push(novoAluno);
  return res.status(201).json(novoAluno);
}

function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, email, curso_id } = req.body;

  const indice = db.alunos.findIndex((item) => item.id === id);
  if (indice === -1) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  if (curso_id !== undefined) {
    const cursoExiste = db.cursos.some((curso) => curso.id === Number(curso_id));
    if (!cursoExiste) {
      return res.status(400).json({ mensagem: 'curso_id inválido.' });
    }
  }

  db.alunos[indice] = {
    ...db.alunos[indice],
    nome: nome ?? db.alunos[indice].nome,
    email: email ?? db.alunos[indice].email,
    curso_id: curso_id !== undefined ? Number(curso_id) : db.alunos[indice].curso_id
  };

  return res.status(200).json(db.alunos[indice]);
}

function remover(req, res) {
  const id = Number(req.params.id);
  const indice = db.alunos.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
  }

  db.alunos.splice(indice, 1);
  return res.status(204).send();
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};
