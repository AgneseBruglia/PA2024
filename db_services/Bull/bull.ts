import { Job } from 'bull';
import * as ControllerDB from '../routes_db/controller_db';
import * as ControllerInference from '../routes_db/controller_inference';
const Queue = require('bull');

export const completedJobResults: { [job_id: string]: any } = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} });

queue.process(async function (job: any, done: any) {

  const dataset_name: string = job.data.dataset_name;
  const model_name: string = job.data.model_name;

  try {
    
    const result = await ControllerInference.doInference(dataset_name, model_name);
    console.log('RISULTATO doInference: ', result);
    if (result.data.status !== 200) {   // CAPIRE COSA SUCCEDE NELLO STATUS FAILED  
      return done(new Error(`Job failed with status code: ${result.data.status}`));
    }

    done(null, result.data.data); 
  } catch (error) {
    done(error); 
  }
});

queue.on('completed', function (job: Job) {
  completedJobResults[job.id] = job.returnvalue;
});

queue.on('failed', function (job: any, error: any) {
  console.log(`Job ${job.id} failed with error: ${error.message}`);
});
