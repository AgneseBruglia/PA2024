import { Sequelize, DataTypes } from 'sequelize';
import Database from '../sequelize';

/**
 * Connessione con il RDBMS
 */
const sequelize: Sequelize = Database.getInstance();

/**
 * Definizione della tabella 'User'
 */
export const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    residual_tokens: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER'
    }
}, {
    tableName: 'users'
});

/**
 * Definizione della tabella 'Dataset'
 */
export const Dataset = sequelize.define('dataset', {
    dataset_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    videos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    indexes: [
        { unique: true, fields: ['dataset_name', 'email'] }
    ]
});

/**
 * Definizione della relazione tra le tabelle
 */
User.hasMany(Dataset, {
    foreignKey: {
        name: 'email',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
Dataset.belongsTo(User, { foreignKey: 'email' });

/**
 * Funzione per la sincronizzazione delle tabelle nel DB e per il seed
 */
const syncModels = async () => {
    try {
        await sequelize.sync({ force: true });
        await createUsers();
    } catch (error) {
        console.error('Errore durante la sincronizzazione dei modelli:', error);
    }
};

/**
 * Funzione per la creazione degli utenti nel database
 */
async function createUsers() {
    try {
        const newAdmin = await User.create({
            name: 'Mario',
            surname: 'Rossi',
            email: 'mariorossi@gmail.com',
            type: 'ADMIN',
            residual_tokens: 200
        });
        const newUser1 = await User.create({
            name: 'Giuseppe',
            surname: 'Verdi',
            email: 'giuseppeverdi@gmail.com',
            type: 'USER',
            residual_tokens: 200
        });
        const newUser2 = await User.create({
            name: 'Jorge',
            surname: 'Bergoglio',
            email: 'pontefice@gmail.com',
            type: 'USER',
            residual_tokens: 1
        });
    } catch (error) {
        console.error('Errore durante la creazione dell\'utente:', error);
    }
}

syncModels();
