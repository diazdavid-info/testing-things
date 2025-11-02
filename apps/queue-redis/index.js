import { Queue } from 'bullmq';
import express from "express";

export const queue = new Queue('bookings', {
    connection: { host: '127.0.0.1', port: 6379 }
});

const app = express()
const port = 4001

app.use(express.json())
app.post('/booking/:id', async (req, res) => {
    const { id } = req.params;
    const job = await queue.add('create.booking', { id });
    res.status(202).json({ jobId: job.id, status: 'enqueued' });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
