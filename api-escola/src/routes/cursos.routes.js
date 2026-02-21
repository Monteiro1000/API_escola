const { Router } = require('express');
const cursosController = require('../controllers/cursos.controller');

const router = Router();

router.get('/', cursosController.listar);
router.get('/:id', cursosController.buscarPorId);
router.post('/', cursosController.criar);
router.put('/:id', cursosController.atualizar);
router.delete('/:id', cursosController.remover);

module.exports = router;
