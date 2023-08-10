const pool = require('../conexao/conexao');

const listaCategorias = async (req, res) => {

    try {

        const query = `select * from categorias`;

        // const categoriasListadas = await pool.query(query)

        /* const { rowCount } = await pool.query(query)
 
         if (rowCount === 0) {
             return res.status(404).json({ mensagem: 'Não existe nenhuma categoria' })
         }*/


        const categoriasListadas = await pool.query(query)
        return res.json(categoriasListadas.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

};

const detalharCategoria = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `select * from categorias where  id = $1`


        const { rowCount, rows } = await pool.query(query, [id])

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Categoria informada não existe' })
        }

        const categoria = {
            id: rows[0].id,
            usuario_id: rows[0].usuario_id,
            descricao: rows[0].descricao
        }

        return res.json(categoria);

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }


}

module.exports = {
    listaCategorias,
    detalharCategoria,
}