import { User, Dataset } from '../models/models'
import { Op } from 'sequelize'

/**
 * Controller per le funzioni di Middleware per interfacciarsi con il Model
 */

/**
 * Funzione 'getTokens'
 * 
 * Funzione per controllare i token di un certo utente: 
 * - Per controllare che siano in numero maggiore di zero, altrimenti dà errore e rifiuta la richiesta;
 * - Per tornare il numero di tokens residui.
 * 
 * @param email Email dell'utente di cui controllare i tokens
 * @param checkResidual Flag booleano per distinguere il tipo di operazione da effettuare
 */
export async function getTokens(email: any, checkResidual: boolean = false): Promise<number> {
    if (!checkResidual) {
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email,
                residual_tokens: { [Op.gt]: 0 }
            }
        });
        if(user !== null){
            const tokens = user?.getDataValue('residual_tokens');
            return tokens as number;
        }
        return 0;
    }
    else {
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email
            }
        });
        const tokens: number = parseInt(user?.getDataValue('residual_tokens'));
        return tokens;
    }
}

/**
 * Funzione 'userUpdate'
 * 
 * Funzione per aggiornare il numero di tokens di un certo utente.
 * 
 * @param tokens Tokens da inserire nell'attributo di un certo utente
 * @param email Email dell'utente a cui inserire i tokens
 */
export async function userUpdate(tokens: number, email: any): Promise<any> {
    const result = await User.update({ residual_tokens: tokens }, { where: { email: email } });
    return result;
}

/**
 * Funzione 'getDataset'
 * 
 * Funzione per tornare un dataset con certe caratteristiche per un certo utente.
 * 
 * @param dataset_name Nome del dataset da cercare
 * @param email Email dell'utente per cui fare la ricerca
 */
export async function getDataset(dataset_name: any, email: any): Promise<any> {
    const result = await Dataset.findOne({
        where: {
            dataset_name: dataset_name,
            email: email
        }
    });
    return result;
} 

/**
 * Funzione 'getUser'
 * 
 * Funzione per tornare un utente con certe caratteristiche.
 * 
 * @param email Email dell'utente da cercare
 * @param req Richiesta del client
 * @param findAll Flag booleana per distinguere la tipologia di operazione
 */
export async function getUser(email: any, req: any, findAll: boolean = false): Promise<any> {
    if (findAll) {
        const result = await User.findAll({
            where: { email: req.body.email as string}
        });
        return result;
    } else {
        const result = await User.findOne({
             where: { email: email as string }
        });
        return result;
    }
}
