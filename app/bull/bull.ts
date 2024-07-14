import { Job } from 'bull';
import * as ControllerInference from '../controller/controller_inference';
const Queue = require('bull');

// Viene definito un tipo per l'oggetto che mappa email a array di number
type CompletedJobMap = Record<string, number[]>;

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT || 6379;

// Viene inizializzato un oggetto per tenere traccia dei job completati per ogni email
export const completedJobResults: CompletedJobMap = {};
export const queue = new Queue('queue', { redis: { port: redisPort, host: redisHost } });

queue.process(async function (job: any, done: any) {
  const dataset_name: string = job.data.dataset_name;
  const model_name: string = job.data.model_name;
  const email: string = job.data.email;

  try {
    const result = await ControllerInference.doInference(email, dataset_name, model_name);

    if (result.status !== 200) {
      const status: number = result.status;
      const errMessage: string = result.message;
      done(new Error(`Status code: ${status}. ${errMessage}`), result);
      return;
    }

    done(null, result);
  } catch (error) {
    done(error);
  }
});

queue.on('completed', function (job: Job) {
  const email: string = job.data.email;
  const jobId: number = parseInt(job.id as string);


  if (completedJobResults[email]) {
    completedJobResults[email].push(jobId);
  } else {
    completedJobResults[email] = [jobId];
  }
});

queue.on('failed', function (job: any, error: any) {

});
