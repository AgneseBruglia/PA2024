import { Job} from 'bull';
import { queue } from '../bull/bull'
import { EnumError } from '../factory/errors';
import { controllerErrors } from './controller_db';


interface Result {
    process_id: number;
    status: string; 
    error?: string;
    data?: any;
}

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

            if(status === 'completed') result.data = job.returnvalue;

            return result;
        }));

        return resultsPromise;

    } catch (error: any) {
        controllerErrors(EnumError.JobsFetchError, res);
    }
}

export async function getResult(job_id: number, res: any, email: string): Promise<any> {
    try {
        const jobs: Job[] = await queue.getJobs(['completed']);
        const jobResult = jobs.find(job => job.id === `${job_id}` && job.data.email === email);
        if (jobResult?.returnvalue===undefined || jobResult?.returnvalue===null) {
            throw new Error;
        }
      
        return {
            successo: true,
            data: jobResult.returnvalue
        }
    }
    catch(error:any) {
        controllerErrors(EnumError.JobResultError, res);
    }
}



export async function resetBull(): Promise<void>{
    await queue.obliterate({ force: true });
}


