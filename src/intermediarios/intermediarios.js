const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../conexao/conexao')
const senhaJwt = require("../senhaJwt")

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ "mensagem": "Verifique todos os campos" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = `insert into usuarios  (nome, email, senha)
        values
        ($1, $2, $3) returning *`

        const usuario = await pool.query(query, [nome, email, senhaCriptografada]);

        const { senha: _, ...dadosRestantes } = usuario.rows[0];

        console.log(dadosRestantes);

        return res.status(201).json({ "mensagem": dadosRestantes });
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro interno do servidor" });
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body

    try {
        const query = `select * from usuarios where email = $1`

        const usuario = await pool.query(query, [email]);

        if (!usuario.rows[0]) {
            return res.status(404).json({ "mensagem": "Email ou senha invalidos" });
        }

        const verificarSenha = bcrypt.compare(senha, usuario.rows[0].senha);

        if (!verificarSenha) {
            return res.status(404).json({ mensagem: "Email ou senha invalido" });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: "360h" })


        const { senha: _, ...usuariologado } = usuario.rows[0];

        return res.status(201).json({ usuario: usuariologado, token });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "mensagem": "Erro interno do servidor" });
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}