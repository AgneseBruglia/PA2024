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
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true  // Aggiunto vincolo di unicità per l'email
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
    videos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true  // Modificato per consentire valore null
    },
}, {
    indexes: [
        { unique: true, fields: ['dataset_name', 'id'] }  // Vincolo di unicità su dataset_name e id_user
    ]
});

// Definizione della relazione tra le tabelle
User.hasMany(Dataset, {
    foreignKey: {
        name: 'id',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
Dataset.belongsTo(User, { foreignKey: 'id' });

User.sync({ alter: true });
Dataset.sync({ alter: true });
