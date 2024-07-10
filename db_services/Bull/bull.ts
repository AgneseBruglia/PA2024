import * as ControllerDB from '../routes_db/controller_db'
import * as ControllerInference from '../routes_db/controller_inference';

const Queue = require('bull');

export const completedJobResults: { [jobId: string]: any } = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} }); // Specify Redis connection using object

queue.process(async function (job: any, done: any) {

  // Esegui il lavoro utilizzando i dati passati al job
  const dataset_name: string = job.data.dataset_name;
  const model_name: string = job.data.model_name;
  const res: any = job.data.res;
  // Chiamata alla funzione che utilizza res come parametro
  //const result = await ControllerInference.doInference(dataset_name, model_name, res);
  waitFor15Seconds();
  const result = {"PROVA: " : "OK"};
  // Esempio di gestione della risposta
  completedJobResults[job.id] = result;

  done(); // Segnala il completamento del job
});

// Funzione asincrona per utilizzare await
async function waitFor15Seconds(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 15000));
}


queue.on('completed', function (job: any, result: any) {
    console.log('FINITO');
    console.log('RISULTATO: ', result);
  })
