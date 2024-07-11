import { Job } from 'bull';
import * as ControllerDB from '../routes_db/controller_db';
import * as ControllerInference from '../routes_db/controller_inference';
import { EnumError, getError } from '../factory/errors';
const Queue = require('bull');

export const completedJobResults: { [job_id: string]: any } = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} });

queue.process(async function (job: any, done: any) {

  const dataset_name: string = job.data.dataset_name;
  const model_name: string = job.data.model_name;
  const email: string = job.data.email;

  try {
    
    const result = await ControllerInference.doInference(email, dataset_name, model_name);
    console.log('RESULT: ', result);
    if (('status' in result.data) && ('message' in result.data)) {   // CAPIRE COSA SUCCEDE NELLO STATUS FAILED  
      const status: number = result.status as number;
      const errMessage: string = result.errMessage as string;;
      done(new Error(`Status code: ${status}. ${errMessage}`));
    }

    done(null, result); 
  } catch (error) {
    done(error); 
  }
});

queue.on('completed', function (job: Job) {
  completedJobResults[job.id] = job.returnvalue;
});

queue.on('failed', function (job: any, error: any) {
  console.log(`Job ${job.id} failed with error: ${error.message}`);
  job.returnvalue = error.message;
});
