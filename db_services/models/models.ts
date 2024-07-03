import { Sequelize, DataTypes } from 'sequelize';
import Database from '../sequelize';

/*
* Connessione con il RDBMS
*/
const sequelize: Sequelize = Database.getInstance();

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true
    },
    surname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        primaryKey: true
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
    dataset_name: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
});

// Definizione della relazione tra le tabelle
User.hasMany(Dataset, {
    foreignKey: {
        name: 'id_user',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
Dataset.belongsTo(User, { foreignKey: 'id_user' });

User.sync({ alter: true });
Dataset.sync({ alter: true });
