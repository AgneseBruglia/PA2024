import { Sequelize, DataTypes } from 'sequelize';
let path = require("path");
import Database from '../sequelize';

/*
* Connessione con il RDBMS
*/
const sequelize: Sequelize = Database.getInstance();

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    residual_tokens: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER'
    }
});

export const Dataset = sequelize.define('dataset', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    dataset_name: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    dataset_path: {
        type: DataTypes.STRING(80),
        allowNull: false
    }
});

User.sync({ alter: true });
Dataset.sync({ alter: true });
