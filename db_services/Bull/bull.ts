import * as Controller from '../routes_db/controller_db'


const Queue = require('bull');

export const completedJobResults: { [jobId: string]: any } = {};
export const queue = new Queue('queue', { redis: { port: 6379, host: 'redis'} }); // Specify Redis connection using object

queue.process(async function (job: any, done: any) {

  // Esegui il lavoro utilizzando i dati passati al job
  const res = job.data.result;
  // Chiamata alla funzione che utilizza res come parametro
  const result = await Controller.getAllUsers(res);

  // Esempio di gestione della risposta
  completedJobResults[job.id] = result;

  done(); // Segnala il completamento del job
});


queue.on('completed', function (job: any, result: any) {
    console.log('FINITO');
    console.log('RISULTATO: ', result);
  })
