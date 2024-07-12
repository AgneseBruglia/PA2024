import { User, Dataset } from '../models/models'
import { Op } from 'sequelize'

/**
 * Controller per le funzioni di Middleware per interfacciarsi con il Model
 */

// TODO commento
export async function getTokens(email: any, checkResidual: boolean = false): Promise<any> {
    if (!checkResidual) {
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email,
                residual_tokens: { [Op.gt]: 0 }
            }
        });
        //if(user === null || user === undefined) return 0;
        if(user !== null){
            const tokens: number = user?.getDataValue('residual_tokens');
            console.log('TOKENS :', tokens);
            console.log('residual_tokens: ', tokens);
            return tokens;
        }
        console.log('USER: ', user);
        return null;
    }
    else {
        const user = await User.findOne({
            attributes: ['residual_tokens'],
            where: {
                email: email
            }
        });
        const tokens: number = parseInt(user?.getDataValue('residual_tokens'));
        console.log('TOKENS :', tokens);
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
