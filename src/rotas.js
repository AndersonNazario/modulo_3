const { Router } = require('express');
const { listaCategorias, detalharCategoria } = require('./controladores/categorias');
const rotas = Router();

rotas.get('/', (req, res) => {
    return res.status(200).json({ "mensagem": "Tudo certo!" });
})

rotas.get('/categoria', listaCategorias);
rotas.get('/categoria/:id', detalharCategoria);



module.exports = rotas