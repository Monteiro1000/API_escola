const { Router } = require('express');
const alunosController = require('../controllers/alunos.controller');

const router = Router();

router.get('/', alunosController.listar);
router.get('/:id', alunosController.buscarPorId);
router.post('/', alunosController.criar);
router.put('/:id', alunosController.atualizar);
router.delete('/:id', alunosController.remover);

module.exports = router;
