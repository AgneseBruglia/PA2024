import { EnumError } from '../factory/errors';
import Joi from 'joi';


export const enum type{
body = 'body',
query = 'query',
};

export const rechargeTokensSchema = Joi.object({
    email: Joi.string().email().max(50).required(),
    tokens_to_charge: Joi.number().required()
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
    type: Joi.string().max(50).required().valid('USER','ADMIN')
});

export const updateDatasetSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    new_dataset_name: Joi.string().max(50).required(),
});

export const doInferenceSchema = Joi.object({
    dataset_name: Joi.string().max(50).required(),
    model_name: Joi.string().max(50).required().valid('model.tflite','model_8bit.tflite')
});

// Funzione lambda per la validazione
// Funzione lambda per la validazione
export const validateSchema = (schema: Joi.ObjectSchema<any>, source: 'body' | 'query') =>  async (req: any, res: any, next: any): Promise<void> => {
    const data = source === 'body' ? req.body : req.query;
    console.log(`dataset_name from ${source}: `, data.dataset_name);
    try {
        await schema.validateAsync(data);
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
// Utilizzo della funzione lambda con lo schema desiderato
//const checkInputBody = validateSchema(rechargeTokensSchema);  // Puoi passare qualsiasi schema qui
