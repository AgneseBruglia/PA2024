import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

export const jobQueue = new Queue('Job', {
  connection: {
    host: 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});
