import { Job, JobStatus } from 'bull';
import { queue, completedJobResults } from '../Bull/bull'
import { EnumError, getError } from '../factory/errors';
import { controllerErrors } from './controller_db';


interface Result {
    process_id: number;
    status: string; 
    error?: string;
}

export async function getUserJobs(email: string, res: any): Promise<any> {
    try {
        let jobs: Job[] = await queue.getJobs();
        let userJobs: Job[] = jobs.filter((job: Job) => job.data.email == email);
        console.log('userJobs: ', userJobs);
      
        let resultsPromise: Promise<Result[]> = Promise.all(userJobs.map(async (job: Job) => {
            const status = await job.getState();
            //console.log('id: ' + job.id + ' STATUS: ' + status);
            let result: Result = {
                process_id: job.id as number,
                status: status as string,
            };
            
            if (status === 'failed') {
                //console.log('RETURN VALUE FAILED: ', job.returnvalue);
                result.error = job.failedReason;
                //console.log('RESUL FAILED PROCESS: ', result);
            }

            return result;
        }));

        return resultsPromise;

    } catch (error: any) {
        controllerErrors(EnumError.JobsFetchError, error, res);
    }
}

export async function getResult(job_id: number, res: any): Promise<any> {
    try {
        const jobs: Job[] = await queue.getJobs(['completed']);
        const jobResult = jobs.find(job => job.id === `${job_id}`);
        if (jobResult?.returnvalue===undefined || jobResult?.returnvalue===null) {
            throw new Error;
        }
      
        return {
            successo: true,
            data: jobResult.returnvalue.data
        }
    }
    catch(error:any) {

        controllerErrors(EnumError.JobResultError, error, res);
    }
}



function getMessageStatusError(jobResult: any): any {
    const status_code: number = parseInt(jobResult.data.status);
    const error_message: string = jobResult.data.data as string;
    return {status_code, error_message};
}