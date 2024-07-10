import { Job, JobStatus } from 'bull';
import { queue, completedJobResults } from '../Bull/bull'
import { EnumError, getError } from '../factory/errors';
import { controllerErrors } from './controller_db';

export async function getUserJobs(email: string, res: any): Promise<any> {
    try {
        let jobStatuses: JobStatus[] = ['waiting', 'active', 'completed', 'failed', 'delayed'];
        let jobs: Job[] = await queue.getJobs(jobStatuses);
        let userJobs: Job[] = jobs.filter((job: Job) => job.data.email === email);
        let userJobsJSON = userJobs.map((job: Job) => job.toJSON());
        return userJobsJSON;
    }
    catch(error:any) {
        controllerErrors(EnumError.JobsFetchError, error, res);
        return error.toJSON();
    }
}

export async function getResult(job_id: number, res: any): Promise<any> {
    try {
        let job = await queue.getJob(job_id);
        if (!job) {
            let error = EnumError.JobNotFoundError;
            return getError(error).getErrorObj();
        }
        // Accedi al risultato memorizzato per l'ID del job
        let jobResult = completedJobResults[job_id];
        if (!jobResult) {
            let error = EnumError.JobResultError;
            return getError(error).getErrorObj();
        }
    }
    catch(error:any) {
        console.error('Error fetching job result:', error);
        return {
            status: 500,
            error: 'An error occurred while fetching the job result' 
        }
    }
}