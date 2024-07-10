import {EmptyResultError, IntegerDataType } from 'sequelize';
import { Dataset, User } from '../models/models';
import { DatabaseError } from 'pg';
import { EnumError, getError } from '../factory/errors';
import * as childProcess from 'child_process';
import * as ControllerDb from './controller_db';
import axios from 'axios';
const fs = require('fs');
const path = require('path');

// Interfaccia per descrivere la struttura dell'utente
interface UserInput {
    name: string;
    surname: string;
    email: string;
    type: string;
    residual_tokens: number;
}

// Interfaccia per descrivere la struttura della risposta al client
interface Json {
    successo: boolean;
    data?: any; 
    errore?: string;
}

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
 * @param err L'effettivo errore sollevato
 * @param res La risposta da parte del server
 */
export function controllerErrors(enum_error: EnumError, err: Error, res: any) {
    const new_err = getError(enum_error).getErrorObj();
    res.status(new_err.status).json(new_err.message);
}

export async function doInference(dataset_name: String , model_name: string, res: any): Promise<any>{
    try{
        const dataset = await Dataset.findOne({
            where: {
              dataset_name: dataset_name
            },
          })        
        if(dataset === null) throw new Error;
        else{
            const videos: string[] = dataset.getDataValue('videos');
            const python_inference_host: string = process.env.PYTHON_HOST || '';
            const python_inference_port: number = (process.env.PYTHON_PORT || 0) as number;
            const body = {"model_name": model_name, "videos": videos};
            const result = await axios.post(`http://${python_inference_host}:${python_inference_port}/inference`,body);
            return{
                successo: true,
                data: result
            }
        }
    }
    catch(error:any){
        controllerErrors(EnumError.InternalServerError, error, res);
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
 * @param res La risposta da parte del server
 */
export async function checkTokensInference(dataset_name: string, email:  string, res: any): Promise<any>{
  
    try{
        const dataset = await Dataset.findOne({
            where: {
              dataset_name: dataset_name
            },
          })
        const user = await User.findOne({
            where: {
              email: email
            },
          })
        // Se è presente il dataset ed i video: 
        if(dataset && (dataset.getDataValue('videos').length !== 0) && user){
            const videos: string[] = dataset.getDataValue('videos');
            const remain_tokens: number = user.getDataValue('residual_tokens') as number;
            const cost_inference: number = await getVideoFrames(videos, res) as number;

            // Se i tokens bastano, allora ritorno true e aggiorno i tokens del dataset 
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
        controllerErrors(EnumError.InternalServerError, error, res);
    }
}

const getVideoFrames = async (videos: string[], res: any): Promise<any> => {
    try {
        // Converte l'array di video in una stringa di query parameter  
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
        controllerErrors(EnumError.InternalServerError, error, res);
    }
};
