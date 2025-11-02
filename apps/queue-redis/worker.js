import { Worker } from 'bullmq';
import {setTimeout} from 'node:timers/promises'

const worker = new Worker('bookings', async job => {
    const { id } = job.data;
    await setTimeout(2000)
    console.log(id);
    return { success: true };
}, { connection: { host: '127.0.0.1', port: 6379 }, concurrency: 5 });

const shutdown = async () => {
    console.log('🔌 Cerrando worker...');
    await worker.close();
    process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
