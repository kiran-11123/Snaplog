import express from 'express'
import redis from 'redis'
import { createClient } from 'redis'
import logger from '../../utils/logger.js';

const redis_client = createClient();



logger.info('Connecting to Redis...');
redis_client.on('error', (err) => logger.error('Redis Client Error', err));

await redis_client.connect();

export default redis_client;