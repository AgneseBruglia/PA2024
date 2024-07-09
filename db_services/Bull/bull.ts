import * as ControllerDB from '../routes_db/controller_db'
import * as ControllerInference from '../routes_db/controller_inference';

const Queue = require('bull');

export const completedJobResults: { [jobId: string]: any } = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} }); // Specify Redis connection using object

queue.process(async function (job: any, done: any) {

  // Esegui il lavoro utilizzando i dati passati al job
  const dataset_name: string = job.data.dataset.name;
  const model_name: string = job.data.model.name;
  const res: any = job.data.res;
  // Chiamata alla funzione che utilizza res come parametro
  const result = await ControllerInference.doInference(dataset_name, model_name, res);

  // Esempio di gestione della risposta
  completedJobResults[job.id] = result;

  done(); // Segnala il completamento del job
});


queue.on('completed', function (job: any, result: any) {
    console.log('FINITO');
    console.log('RISULTATO: ', result);
  })
