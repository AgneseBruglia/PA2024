import { User, Dataset } from '../models/models'
import { Op } from 'sequelize'

/**
 * Controller per le funzioni di Middleware per interfacciarsi con il Model
 */

// TODO commento
export async function getTokens(email: any, checkResidual: boolean = false): Promise<number> {
    if (!checkResidual) {
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email,
                residual_tokens: { [Op.gt]: 0 }
            }
        });
        console.log('USER uguale a NULL : ', user===null );
        //if(user === null || user === undefined) return 0;
        if(user !== null){
            console.log('USER dentro getTokens: ', user);
            const tokens = user?.getDataValue('residual_tokens');
            console.log('Tokens dentro getTokens: ', tokens)
            return tokens as number;
        }
        console.log('PRIMA DELLO ZEROOOOOOOO');
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

// TODO commento
export async function userUpdate(tokensRemains: number, email: any): Promise<any> {
    const result = await User.update({ residual_tokens: tokensRemains }, { where: { email: email } });
    return result;
}

// TODO commento
export async function getDataset(dataset_name: any, email: any): Promise<any> {
    const result = await Dataset.findOne({
        where: {
            dataset_name: dataset_name,
            email: email
        }
    });
    return result;
} 

// TODO commento
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
