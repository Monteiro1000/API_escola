const { Router } = require('express');
const alunosRoutes = require('./alunos.routes');
const cursosRoutes = require('./cursos.routes');

const router = Router();

router.use('/alunos', alunosRoutes);
router.use('/cursos', cursosRoutes);

module.exports = router;
