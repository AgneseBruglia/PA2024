import { Job } from 'bull';
import * as ControllerDB from '../routes_db/controller_db';
import * as ControllerInference from '../routes_db/controller_inference';
import { EnumError, getError } from '../factory/errors';
const Queue = require('bull');

export const completedJobResults: number[] = [];
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} });

queue.process(async function (job: any, done: any) {

  const dataset_name: string = job.data.dataset_name;
  const model_name: string = job.data.model_name;
  const email: string = job.data.email;

  try {
    
    const result = await ControllerInference.doInference(dataset_name, model_name);
    if (result.status as number !== 200) {   
      const status: number = result.status as number;
      const errMessage: string = result.message as string;;
      done(new Error(`Status code: ${status}. ${errMessage}`), result);
    }

    done(null, result); 
  } catch (error) {
    console.log('Dentro il catch: ', error);
    done(error);
  }
});

queue.on('completed', function (job: Job) {
  completedJobResults.push(parseInt(job.id as string));
});

queue.on('failed', function (job: any, error: any) {
  //console.log(`Job ${job.id} failed with error: ${error.message}`);
  //console.log('JOB FALLITO: ', job.failedReason);
  //console.log('JOB FALLITO COMPLETO: ', job);
});
