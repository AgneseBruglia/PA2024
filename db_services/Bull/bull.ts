import { Job } from 'bull';
import * as ControllerInference from '../controller/controller_inference';
const Queue = require('bull');

// Definisci un tipo per l'oggetto che mappa email a array di number
type CompletedJobMap = Record<string, number[]>;

// Inizializza un oggetto per mantenere traccia dei job completati per ogni email
export const completedJobResults: CompletedJobMap = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} });

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
      return; // esce dalla funzione se c'è un errore
    }

    done(null, result); 
  } catch (error) {
    console.log('Errore nel processo di inferenza: ', error);
    done(error);
  }
});

queue.on('completed', function (job: Job) {
  const email: string = job.data.email;
  const jobId: number = parseInt(job.id as string);

  // Aggiungi l'ID del job all'array associato all'email
  if (completedJobResults[email]) {
    completedJobResults[email].push(jobId);
  } else {
    completedJobResults[email] = [jobId];
  }
});

queue.on('failed', function (job: any, error: any) {
  // Gestisci i job falliti se necessario
});
