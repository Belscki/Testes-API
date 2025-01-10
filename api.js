// ----------------------------------------------------------------Variaveis
const express = require('express');
const app = express();
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('stap', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Desabilitar logs do Sequelize
});
app.use(cors());
app.use(express.json());

// ----------------------------------------------------------------Objetos SQL
const Pauta = sequelize.define('pautas', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Status: {
        type: DataTypes.ENUM('Ativo', 'Inativo'),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

const Socio = sequelize.define('socios', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CodigoFuncional: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CPF: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});
const Voto = sequelize.define('votos', {
    ID_Pauta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pautas', // Nome da tabela referenciada
            key: 'ID'
        },
        primaryKey: true
    },
    ID_Socio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'socios', // Nome da tabela referenciada
            key: 'ID'
        },
        primaryKey: true
    },
    Voto: {
        type: DataTypes.ENUM('A favor', 'Contra', 'Nulo'),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

const Users = sequelize.define('users', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

// ----------------------------------------------------------------Requisições
app.get('/', (req, res) => {
    res.json([{ Mensagem: "API em Funcionamento!" }]);
});

app.get('/pautaSOM', async (req, res) => {
    try {
        const ptafavor = await Voto.count({
            where: {
                Voto: "A favor"
            }
        })
        const ptContra = await Voto.count({
            where: {
                Voto: "Contra"
            }
        })
        res.json({ Afavor: ptafavor, Contra: ptContra });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar pautas', error });
    }
});


app.get('/pautas', async (req, res) => {
    try {
        const pautas = await Pauta.findAll();
        res.json(pautas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar pautas', error });
    }
});
app.get('/socios', async (req, res) => {
    try {
        const socios = await Socio.findAll();
        res.json(socios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar socios', error });
    }
});
app.get('/votos', async (req, res) => {
    try {
        const votos = await Voto.findAll();
        res.json(votos);
    } catch (error) {

    }
});

app.get('/teste', async (req, res) => {
    try {
        votos = {
             voto1 : 1,
             voto2 : 2
        }
        res.json(votos);
    } catch (error) {

    }
});

app.get('/geral', async (req, res) => {
    try {
        const pautas = await Pauta.findAll();
        const socios = await Socio.findAll();
        const votos = await Voto.findAll();
        res.json({ pautas, socios, votos });
    } catch {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar votos', error });
    }
});
app.post('/CriarSocio', async (req, res) => {
    let codigo = req.body.CodigoFuncional;
    let nome = req.body.Nome;
    let cpf = req.body.CPF;
    if (!codigo || !nome || !cpf) {
        return res.status(400).json({ message: 'CodigoFuncional, Nome e CPF são obrigatórios' });
    }
    try {
        const novoSocio = await Socio.create({
            CodigoFuncional: codigo,
            Nome: nome,
            CPF: cpf
        });
        console.log('Novo socio:', novoSocio);
        res.json({ mensagem: "Socio Adicionado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar socio', error });
    }
});
app.post('/login', async (req, res) => {
    let codigo = req.body.CodigoFuncional;
    let nome = req.body.Nome;
    let cpf = req.body.CPF;
    if (!codigo || !nome || !cpf) {
        return res.status(400).json({ message: 'CodigoFuncional, Nome e CPF são obrigatórios' });
    }
    const user = await Socio.findOne({
        where: {
            CodigoFuncional: codigo,
            Nome: nome,
            CPF: cpf
        }
    });
    if (user) {
        return res.json({ socioexiste: true, user });
    } else {
        return res.json({ socioexiste: false });
    }
});
app.post('/buscaCod', async (req, res) => {
    let codigo = req.body.CodigoFuncional;
    const user = await Socio.findOne({
        where: {
            CodigoFuncional: codigo,
        }
    });
    const randomUsers = await Socio.findAll({
        order: sequelize.random(),
        limit: 4,
    });
    if (user) {
        return res.json({ socioexiste: true, user, randomUsers });
    } else {
        return res.json({ socioexiste: false });
    }
});

app.post('/buscaNome', async (req, res) => {
    let codigo = req.body.CodigoFuncional;
    let nome = req.body.Nome;
    const user = await Socio.findOne({
        where: {
            CodigoFuncional: codigo,
            Nome: nome
        }
    });
    const randomUsers = await Socio.findAll({
        order: sequelize.random(),
        limit: 4,
    });
    if (user) {
        return res.json({ socioexiste: true, user, randomUsers });
    } else {
        return res.json({ socioexiste: false });
    }
});

app.get('/pautaAtiva', async (req, res) => {
    const pautas = await Pauta.findAll({
        where: {
            Status: "Ativo"
        }
    });
    return res.json({ pautas })
})

app.post('/Votacao', async (req, res) => {
    let ID_Pauta = req.body.ID_Pauta;
    let ID_Socio = req.body.ID_Socio;
    let escolha = req.body.Voto;
    console.log("Dados recebidos:", { ID_Pauta, ID_Socio, escolha });
    try {
        const votoExistente = await Voto.findOne({
            where: {
                ID_Pauta: ID_Pauta,
                ID_Socio: ID_Socio
            }
        });
        if (votoExistente) {
            return res.status(406).json({ message: 'Voto já registrado para este sócio e pauta' });
        }
        // Criação do novo voto
        const novoVoto = await Voto.create({
            ID_Pauta: ID_Pauta,
            ID_Socio: ID_Socio,
            Voto: escolha
        });
        console.log("Voto registrado!");
        res.json({ mensagem: "Voto Adicionado" });
    } catch (error) {
        console.error("Erro ao adicionar voto:", error);
        res.status(500).json({ message: 'Erro ao adicionar voto', error: error.message });
    }
});
app.post('/ConfereVoto', async (req, res) => {
    let ID_Pauta = req.body.ID_Pauta;
    let ID_Socio = req.body.ID_Socio;
    const votoExistente = await Voto.findOne({
        where: {
            ID_Pauta: ID_Pauta,
            ID_Socio: ID_Socio
        }
    });
    if (votoExistente) {
        return res.status(406).json({ message: 'Voto já registrado para este sócio e pauta' });
    }
    res.json({ mensagem: "Voto votavel" });
});

app.post('/loginADM', async (req, res) => {
    let Usuario = req.body.Usuario;
    let Password = req.body.Password;

    const UsuarioISTEM = await Users.findOne({
        where: {
            Usuario: Usuario,
            Password: Password
        }
    });
    if (UsuarioISTEM) {
        return res.json({ mensagem: "Login Aceito" });
    }
    return res.status(406).json({ message: 'Login Incorreto' });
});

// ----------------------------------------------------------------Inicialização
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
