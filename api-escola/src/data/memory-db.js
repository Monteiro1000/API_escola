const db = {
  cursos: [
    { id: 1, nome: 'Desenvolvimento Web' },
    { id: 2, nome: 'Banco de Dados' }
  ],
  alunos: [
    { id: 1, nome: 'Ana Souza', email: 'juliogarotodeprograma', curso_id: 1 },
    { id: 2, nome: 'Bruno Lima', email: 'gilmariolaele', curso_id: 2 }
  ]
};

module.exports = { db };
