const { DataTypes } = require("sequelize/types");
import { Sequelize } from 'sequelize';
import Database from '../sequelize';

/*
* Connessione con il RDBMS
*/
const sequelize: Sequelize = Database.getInstance();

// Definizione delle possibili tipologie di utente
enum UserRole {
    ADMIN = 1,
    USER = 2,
  }

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.USER
    }
});

export const Dataset = sequelize.define('dataset', {
    id_user: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
    },
    dataset_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    dataset_path: {
        type: DataTypes.STRING(80),
        allowNull: false
    }
});
