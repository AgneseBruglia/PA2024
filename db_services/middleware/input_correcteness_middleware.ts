import { EnumError } from '../factory/errors';
import Joi from 'joi';

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

// Funzione lambda per la validazione
export const validateSchema = (schema: Joi.ObjectSchema<any>) =>  async (req: any, res: any, next: any): Promise<void> => {
    const data = req.params || req.body;
    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        next(EnumError.IncorrectInputError);
    }
};

export async function validateInsertVideo(req: any, res: any, next: any): Promise<void>{
    const insertVideoSchema = Joi.object({
        dataset_name: Joi.string().max(50).required(),
        new_videos: Joi.array().items(Joi.string()).required()
    });

    try{
        const dataset_name: string = req.params.dataset_name;
        const new_videos: string[] = req.body.new_videos;
        insertVideoSchema.validateAsync({ dataset_name: dataset_name, new_videos: new_videos });
        next();
    }
    catch(error:any){
        next(EnumError.IncorrectInputError);
    }
    
}
// Utilizzo della funzione lambda con lo schema desiderato
//const checkInputBody = validateSchema(rechargeTokensSchema);  // Puoi passare qualsiasi schema qui
