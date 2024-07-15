import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe Singleton per la connessione con il DB
 */
class Database {
  private static instance: Sequelize;

  /**
   * Costruttore privato, utile per implementazione Singleton
   */
  private constructor() { }

  /**
   * Database: getInstance()
   * 
   * Il metodo ritorna l'istanza corrente della classe Database
   * 
   * @returns Database.instance
   */
  public static getInstance(): Sequelize {
    if (!Database.instance) {
      const dbName = process.env.POSTGRES_DB as string;
      const dbUser = process.env.POSTGRES_USER as string;
      const dbPassword = process.env.POSTGRES_PASSWORD;
      const dbHost = process.env.POSTGRES_HOST || 'pgs';
      const dbPort = parseInt(process.env.POSTGRES_PORT || '5432');
      Database.instance = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        logging: false,
      });
    }
    return Database.instance;
  }
}

export default Database;
