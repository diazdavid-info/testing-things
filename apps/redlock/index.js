import Redlock, {ResourceLockedError} from "redlock";
import {createClient} from "redis";
import {setTimeout} from "node:timers/promises"

const redis = createClient({
    url: process.env.REDIS_URL_CONNECTION,
    connectTimeout: 5000,
    timeout: 5000
})
if (!redis.evalsha) redis.evalsha = redis.evalSha.bind(redis);

await redis.connect()
const redlock = new Redlock([redis], {
    driftFactor: 0,
    retryCount: 0
});

const token = crypto.randomUUID(); // o cualquier UUID/v4
try {
    const result = await redis.set('lock:recurso:test', token, { NX: true, PX: 2000 });
    if (result !== 'OK') throw new Error('No adquirí el lock');
    try {
        // Hacer trabajo crítico aquí
    } finally {
        const releaseScript = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        await redis.eval(releaseScript, {keys: ['lock:recurso:test'], arguments: [token]});
    }
} catch (err) {
    const releaseScript = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
    await redis.eval(releaseScript, {keys: ['lock:recurso:test'], arguments: [token]});
}


