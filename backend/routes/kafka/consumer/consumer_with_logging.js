// kafkaConsumer.js
import { Kafka } from 'kafkajs';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import kafka_kafka_logger from './kafka_logging';

// Kafka Setup
const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'notes-group' });
const Topic = 'notes-topic';



// Main Consumer Function
const consume = async () => {
    try {
        await consumer.connect();
        kafka_logger.info("✅ Kafka Consumer Connected");

        await consumer.subscribe({ topic: Topic, fromBeginning: true });
        kafka_logger.info(`📡 Subscribed to Topic: ${Topic}`);

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    kafka_logger.info({
                        event: "MESSAGE_RECEIVED",
                        messageData: data,
                        topic,
                        partition,
                        offset: message.offset
                    });
                } catch (err) {
                    kafka_logger.error({
                        event: "MESSAGE_PROCESSING_ERROR",
                        error: err.message
                    });
                }
            },
        });

    } catch (error) {
        kafka_logger.error({
            event: "CONSUMER_INIT_ERROR",
            error: error.message
        });
    }
};

// Graceful Shutdown
process.on('SIGINT', async () => {
    kafka_logger.warn("🛑 SIGINT Received → Disconnecting Kafka Consumer...");
    await consumer.disconnect();
    process.exit();
});

process.on('SIGTERM', async () => {
    kafka_logger.warn("🛑 SIGTERM Received → Disconnecting Kafka Consumer...");
    await consumer.disconnect();
    process.exit();
});

// Start Consumer
consume();
