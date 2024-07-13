import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 

class Database {
  private static instance: Sequelize;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      const dbName = process.env.POSTGRES_DB as string ;
      const dbUser = process.env.POSTGRES_USER as string;
      const dbPassword = process.env.POSTGRES_PASSWORD;
      const dbHost = process.env.POSTGRES_HOST;
      const dbPort = parseInt(process.env.POSTGRES_PORT as string);

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
