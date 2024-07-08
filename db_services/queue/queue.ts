import { Queue, Worker, Job, QueueScheduler, ConnectionOptions } from 'bullmq';
import { getAllUsers } from './routes_db/controller_db';
import Redis from 'redis';

const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retry_strategy: (times) => Math.min(times * 50, 2000),
};

const client = Redis.createClient(redisOptions);

client.on('error', (err) => console.error('Redis Client Error', err));

interface JobData {
  res: any;
}

const userQueue = new Queue<JobData>('userQueue', {
  connection: {
    client: client as any, // Cast a 'any' per adattarlo a BullMQ
    enableOfflineQueue: true, // Opzionale, dipende dalle tue esigenze
  },
});

new QueueScheduler('userQueue', {
  connection: {
    client: client as any, // Cast a 'any' per adattarlo a BullMQ
  },
});

const userWorker = new Worker<JobData>('userQueue', async (job: Job<JobData>) => {
  const users = await getAllUsers(job.data.res);
  return users;
}, {
  connection: {
    client: client as any, // Cast a 'any' per adattarlo a BullMQ
  },
});

userWorker.on('completed', (job, result) => {
  job.data.res.json(result);
});

export { userQueue };
