import { EnumError } from '../factory/errors';
import Joi from 'joi';
import { completedJobResults } from '../bull/bull'

export const enum type{
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
    type: Joi.string().max(50).required().valid('USER','ADMIN'),
    residual_tokens: Joi.number().integer().greater(0).required()
});

export const updateDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    new_dataset_name: Joi.string().max(50).required(),
});

export const doInferenceSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    model_name: Joi.string().max(50).required().valid('model.tflite','model_8bit.tflite')
});

export const resultSchema = Joi.object({
    id: Joi.number().integer().positive().required()
});

export const getDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50)
});


export const generateJwtSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    type: Joi.string().max(50).required().valid('USER','ADMIN'),
    expiration: Joi.number().integer().positive().min(1).max(48).required()
});


export const validateSchema = (schema: Joi.ObjectSchema<any>, source: 'body' | 'query', includeEmail: boolean = true) => async (req: any, res: any, next: any): Promise<void> => {
    const data = source === 'body' ? req.body : req.query;

    if (includeEmail) {
        email = req.decodeJwt.email;
        console.log(`Email: ${email}`);
    }
    
    console.log(`dataset_name from ${source}: `, data.dataset_name);
    
    try {
        await schema.validateAsync(data);
        console.log('SCHEMA OK');
        next();
    } catch (error) {
        next(EnumError.IncorrectInputError);
    }
};

export async function validateInsertVideo(req: any, res: any, next: any): Promise<void>{
    const insertVideoSchema = Joi.object({
        dataset_name: Joi.string().max(50).required(),
        new_videos: Joi.array().items(Joi.string()).min(1).required()
    });
    try{
        const dataset_name: string | undefined = req.query.dataset_name;
        const new_videos: string[] | undefined = req.body.new_videos;
        await insertVideoSchema.validateAsync({ dataset_name: dataset_name, new_videos: new_videos });
        next();
    }
    catch(error:any){
        next(EnumError.IncorrectInputError);
    } 
}
