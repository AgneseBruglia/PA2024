require('.\config.json');
import { Sequelize } from 'sequelize';

/*
*
* Classe Singleton
* per la creazione del database
*
*/

class Database {
  private static instance: Sequelize;

  // Costruttore privato 
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize('database', 'username', 'password', {
        host: '127.0.0.1',
        port: 5432,
        dialect: 'postgres',
        logging: false,
      });
    }
    return Database.instance;
  }
}

export default Database;
