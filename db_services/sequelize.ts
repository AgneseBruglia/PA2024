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
      Database.instance = new Sequelize('postgres', 'postgres', 'admin', {
        host: 'pgs',
        port: 5432,
        dialect: 'postgres',
        logging: false,
      });
    }
    return Database.instance;
  }
}

export default Database;
