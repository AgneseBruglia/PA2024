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
    switch (type) {
      case 'createDataset':
        result = await addDataset(data.email, data.dataset_name);
        break;
      case 'getDatasets':
        result = await getDatasets(data.email, data.dataset_name);
        break;
      case 'updateDataset':
        result = await updateDataset(data.email, data.dataset_name, data.new_dataset_name);
        break;
      case 'insertVideoIntoDataset':
        result = await insertVideoIntoDataset(data.email, data.dataset_name, data.new_videos);
        break;
      case 'deleteDataset':
        result = await deleteDataset(data.email, data.dataset_name);
        break;
      case 'visualizeCredits':
        result = await visualizeCredits(data.email);
        break;
      case 'rechargeCredits':
        result = await rechargeCredits(data.email, data.tokens_to_charge);
        break;
      case 'createUser':
        result = await createUser(data);
        break;
      case 'getAllUsers':
        result = await getAllUsers();
        break;
      case 'getAllDataset':
        result = await getAllDataset();
        break;
      default:
        throw new Error(`Tipo di compito sconosciuto: ${type}`);
    }
    return result;
  } catch (error: any) {
    console.error(`Errore durante l'elaborazione del job ${job.name}: ${error.message}`);
    // throw error; // Questo farà segnare il job come fallito
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
