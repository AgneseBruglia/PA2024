import { Job } from 'bull';
import { queue } from '../bull/bull'
import { EnumError } from '../factory/errors';
import { controllerErrors } from './controller_db';

// Interfaccia per descrivere la truttura di un processo
interface Result {
    process_id: number;
    status: string;
    error?: string;
    data?: any;
}

/**
 * Funzione 'getUserJobs'
 * 
 * Funzione per tornare tutti i processi associati a un certo utente.
 * 
 * @param email Email dell'utente di cui recuperare i processi
 * @param res Risposta del server
 */
export async function getUserJobs(email: string, res: any): Promise<any> {
    try {
        let jobs: Job[] = await queue.getJobs();
        let userJobs: Job[] = jobs.filter((job: Job) => job.data.email == email);
        if (userJobs.length === 0) throw new Error;
        let resultsPromise: Promise<Result[]> = Promise.all(userJobs.map(async (job: Job) => {
            const status = await job.getState();
            let result: Result = {
                process_id: job.id as number,
                status: status as string,
            };
            if (status === 'failed') result.error = job.failedReason;

            if (status === 'completed') result.data = job.returnvalue;
            return result;
        }));
        return resultsPromise;
    } catch (error: any) {
        controllerErrors(EnumError.JobsFetchError, res);
    }
}

/**
 * Funzione 'getResult'
 * 
 * Funzione per tornare il risultato di un certo processo.
 * 
 * @param job_id Id del processo di cui tornare il risultato
 * @param res Risposta del server
 * @param email Email dell'utente a cui è associato il processo
 */
export async function getResult(job_id: number, res: any, email: string): Promise<any> {
    try {
        const jobs: Job[] = await queue.getJobs(['completed']);
        const jobResult = jobs.find(job => job.id === `${job_id}` && job.data.email === email);
        if (jobResult?.returnvalue === undefined || jobResult?.returnvalue === null) {
            throw new Error;
        }
        return {
            successo: true,
            data: jobResult.returnvalue
        }
    }
    catch (error: any) {
        controllerErrors(EnumError.JobResultError, res);
    }
}

/**
 * Funzione 'resetBull'
 * 
 * Funzione utilizzata per resettare il contatore dell'id dei processi una volta terminata una sessione.
 */
export async function resetBull(): Promise<void> {
    await queue.obliterate({ force: true });
}
