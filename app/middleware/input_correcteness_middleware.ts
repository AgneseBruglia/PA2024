import { EnumError } from '../factory/errors';
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

let email: string | undefined = undefined;

export const rechargeTokensSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    tokens_to_charge: Joi.number().integer().greater(0).required()
});

export const createDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50).required()
});

export const newVideoSchema = Joi.object({
    new_dataset_name: Joi.string().max(50).required()
});

export const createUserSchema = Joi.object({
    name: Joi.string().max(50).required(),
    surname: Joi.string().max(50).required(),
    email: Joi.string().email().max(50).required(),
    type: Joi.string().required().valid('USER', 'ADMIN'),
    residual_tokens: Joi.number().integer().greater(0).required()
});

export const updateDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    new_dataset_name: Joi.string().max(50).required(),
});

export const doInferenceSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    model_name: Joi.string().required().valid('model.tflite', 'model_8bit.tflite')
});

export const resultSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

export const getDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50)
});

export const generateJwtSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    type: Joi.string().required().valid('USER', 'ADMIN'),
    expiration: Joi.number().integer().positive().min(1).max(48).required()
});




/**
 * Middleware 'validateSchema'
 * 
 * Lambda function con lo scopo di validare la correttezza dell'input passato alla rotta 
 * 
 * @param schema Schema da validare
 * @param source Sorgente da dove prelevare l'input: body o query
 * @param includeEmail Variabile booleana per tracciare indirizzo email, utile per il meccanismo di visione isolata(per utente) della coda
 */
export const validateSchema = (schema: Joi.ObjectSchema<any>, source: 'body' | 'query', includeEmail: boolean = true) => async (req: any, res: any, next: any): Promise<void> => {
    const data = source === 'body' ? req.body : req.query;

    if (includeEmail) {
        email = req.decodeJwt.email;
    }

    try {
        await schema.validateAsync(data);
        next();
    } catch (error) {
        next(EnumError.IncorrectInputError);
    }
};

/**
 * Middleware 'validateInsertVideo'
 * 
 * Lambda function con lo scopo di validare la correttezza dell'input passato alla rotta 
 * 
 * @param req La richiesta da parte del client
 * @param res La risposta da parte del server
 * @param next Il riferimento al middleware successivo
 */
export async function validateInsertVideo(req: any, res: any, next: any): Promise<void> {
    const insertVideoSchema = Joi.object({
        dataset_name: Joi.string().max(50).required(),
        new_videos: Joi.array().items(Joi.string()).min(1).required()
    });
    try {
        const dataset_name: string | undefined = req.query.dataset_name;
        const new_videos: string[] | undefined = req.body.new_videos;
        await insertVideoSchema.validateAsync({ dataset_name: dataset_name, new_videos: new_videos });
        next();
    }
    catch (error: any) {
        next(EnumError.IncorrectInputError);
    }
}
