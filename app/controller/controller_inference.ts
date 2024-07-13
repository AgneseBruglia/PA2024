import { Dataset, User } from '../models/models';
import { EnumError, getError } from '../factory/errors';
import axios from 'axios';

// Interfaccia per descrivere la tipologia di utente
export enum typeOfUser {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

/**
 * Funzione 'controllerErrors'
 * 
 * Funzione invocata dai metodi del Controller in caso di errori e che si occupa di invocare
 * il metodo {@link getError} della Factory di errori per costruire oggetti da ritornare al client
 * nel corpo della risposta.
 * 
 * @param enum_error Il tipo di errore da costruire
 * @param res La risposta da parte del server
 */
export function controllerErrors(enum_error: EnumError, res: any) {
    const new_err = getError(enum_error).getErrorObj();
    res.status(new_err.status).json(new_err.message);
}

/**
 * Funzione 'doInference'
 * 
 * Funzione per eseguire inferenza con un certo modello su un certo dataset.
 * 
 * @param email Email dell'utente che effettua la richiesta
 * @param dataset_name Nome del dataset su cui eseguire l'inferenza
 * @param model_name Modello da utilizzare
 */
export async function doInference(email: string, dataset_name: string, model_name: string): Promise<any> {
    try {
        const dataset = await Dataset.findOne({
            where: {
                email: email,
                dataset_name: dataset_name
            }
        });
        if (dataset === null) {
            throw new Error('Dataset not found');
        } else {
            const videos: string[] = dataset.getDataValue('videos');
            const python_inference_host: string = process.env.PYTHON_HOST as string;
            const python_inference_port: number = parseInt(process.env.PYTHON_PORT as string);

            const body = { "model_name": model_name, "videos": videos };
            const result = await axios.post(`http://${python_inference_host}:${python_inference_port}/inference`, body);

            return {
                status: 200,
                message: result.data 
            };
        }
    } catch (error: any) {


        if (axios.isAxiosError(error)) {

            if (error.response && error.response.data) {

                const statusCode = error.response.data.status_code || error.response.status;
                const errorMessage = error.response.data.error || error.response.statusText;

                return {
                        status: statusCode,
                        message: errorMessage
                    }
                };
            }
        }
    }

/**
 * Funzione 'checkTokensInference'
 * 
 * La funzione ha lo scopo di verificare se il numero di tokens dell'utente bastano per effettuare 
 * l'inferenza. In caso affermativo ritorna True, altrimenti False. Inoltre lancia opportune eccezzioni
 * qualora il db dovesse andare in errore.
 * 
 * @param dataset_name Nome del dataset che si vuole utilizzare per l'inferenza
 * @param email Email dell'utente 
 * @param res La risposta del server
 */
export async function checkTokensInference(dataset_name: string, email:  string, res: any): Promise<any>{
    try{
        const videosData = await Dataset.findOne({
            where: {
              dataset_name: dataset_name
            },
            attributes: [ 'videos' ]
          })
        const user = await User.findOne({
            where: {
              email: email
            },
          })
        if((videosData !== null) && (user !== null)){
            const videos: string[] = videosData.getDataValue('videos');
            const remain_tokens: number = user.getDataValue('residual_tokens') as number;
            const cost_inference: number = await getVideoFrames(videos, res) as number;
            if(remain_tokens >= cost_inference){
                const new_credits: number = remain_tokens - cost_inference; 
                const [numberOfAffectedRows] = await User.update(
                    { residual_tokens: new_credits },
                    {
                      where: { email: email }
                    }
                  );

                if(numberOfAffectedRows === 0 ) throw new Error;
                return true;
            }
            else{
                return false;
            }
        }
        else {
            throw new Error;
        }
    }
    catch(error:any){
        controllerErrors(EnumError.InternalServerError, res);
    }
}

/**
 * Funzione 'getVideoFrames'
 * 
 * Funzione per contare il numero di frame che compongono i video di un dataset.
 * 
 * @param videos Video di cui contare i frame
 * @param res Risposta del server
 */
const getVideoFrames = async (videos: string[], res: any): Promise<any> => {
    try {
        const cost_services_host: string = process.env.COST_SERVICES_HOST || '';
        const cost_services_port: number = parseInt(process.env.COST_SERVICES_PORT as string) || 0;
        const body = {
            video_paths: videos
        };
        const response = await axios.post(`http://${cost_services_host}:${cost_services_port}/cost`, body);
        if (response.status === 200) {
            return response.data.total_frames as number;
        } else {
            throw new Error();
        }
    } catch (error:any) {
        controllerErrors(EnumError.InternalServerError, res);
    }
};
