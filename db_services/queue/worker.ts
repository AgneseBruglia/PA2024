import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import {
  addDataset,
  getDatasets,
  updateDataset,
  insertVideoIntoDataset,
  deleteDataset,
  visualizeCredits,
  rechargeCredits,
  createUser,
  getAllUsers,
  getAllDataset,
} from '../routes_db/controller_db';

dotenv.config();

const jobWorker = new Worker('Job', async job => {
  console.log(`Elaborando il compito ${job.name} con dati: ${JSON.stringify(job.data)}`);
  const { type, data } = job.data;

  try {
    let result;
    result = await getAllUsers(data);
    return result;
  } catch (error: any) {
    console.error(`Errore durante l'elaborazione del job ${job.name}: ${error.message}`);
  }
}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

jobWorker.on('completed', job => {
  console.log(`Compito ${job.id} completato`);
});

jobWorker.on('failed', (job, err) => {
  console.error(`Compito ${job?.id} fallito: ${err.message}`);
});
