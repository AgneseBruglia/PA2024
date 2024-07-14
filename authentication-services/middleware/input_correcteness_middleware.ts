import { EnumErrorAuth } from '../factory/errors';
import Joi from 'joi';

/**
 * 'Input corrrectness middleware'
 * 
 * Sono funzioni di middleware per il controllo di correttezza
 * dei parametri inseriti nelle richieste Postman.
 */

/**
 * Struttura per distinguere i tipi di parametri utilizzati nelle richieste Postman.
 * 'body' indica i parametri inclusi nel corpo della richiesta.
 * 'query' indica i parametri inclusi nella stringa di query dell'URL.
 */
export const enum type {
    body = 'body',
    query = 'query',
};

export const createTokensSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    type: Joi.string().required().valid('ADMIN', 'USER'),
    expiration: Joi.number().integer().min(1).max(48).required()
});

export const validateSchema = (schema: Joi.ObjectSchema<any>, source: 'body' | 'query') => async (req: any, res: any, next: any): Promise<void> => {
    const data = source === 'body' ? req.body : req.query;
    try {
        await schema.validateAsync(data);
        next();
    } catch (error) {
        next(EnumErrorAuth.IncorrectInputError);
    }
};
