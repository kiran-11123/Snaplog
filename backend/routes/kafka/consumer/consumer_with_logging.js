// kafkaConsumer.js
import { Kafka } from 'kafkajs';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize Kafka client
const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'], // replace with your Kafka broker(s)
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'notes-group' });
const Topic = 'notes-topic';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '..', '..', 'logs', 'notes.log');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: logFilePath }),
        new winston.transports.Console() // optional, for console logs
    ]
});

// Main consumer function
const consume = async () => {
    try {
        // Connect to Kafka
        await consumer.connect();
        console.log("Kafka consumer connected.");

        // Subscribe to the topic
        await consumer.subscribe({ topic: Topic, fromBeginning: true });
        console.log(`Subscribed to ${Topic}.`);

        // Run consumer
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    console.log("Received Kafka message:", data);
                    logger.info({ partition, topic, data, timestamp: Date.now() });
                  
                } catch (err) {
                    console.error('Error parsing or processing message:', err);
                }
            },
        });

    } catch (error) {
        console.error('Error in Kafka consumer:', error);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Disconnecting Kafka consumer...');
    await consumer.disconnect();
    process.exit();
});

process.on('SIGTERM', async () => {
    console.log('Disconnecting Kafka consumer...');
    await consumer.disconnect();
    process.exit();
});

// Start consuming
consume();
