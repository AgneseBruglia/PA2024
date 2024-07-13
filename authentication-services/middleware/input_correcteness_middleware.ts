import { EnumErrorAuth } from '../factory/errors';
import Joi from 'joi';


export const enum type{
body = 'body',
query = 'query',
};

export const createTokensSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    type: Joi.string().required().valid('ADMIN', 'USER'),
    expiration: Joi.number().integer().min(1).max(48).required()
});

export const validateSchema = (schema: Joi.ObjectSchema<any>, source: 'body' | 'query') =>  async (req: any, res: any, next: any): Promise<void> => {
    const data = source === 'body' ? req.body : req.query;
    try {
        await schema.validateAsync(data);
        next();
    } catch (error) {
        next(EnumErrorAuth.IncorrectInputError);
    }
};

