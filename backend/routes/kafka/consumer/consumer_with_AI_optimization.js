// kafkaConsumer.js
import { Kafka } from 'kafkajs';
import kafka_kafka_logger from './kafka_logging'; // <-- add this import

// Initialize Kafka client
const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'],
});

// Create a consumer
const consumer = kafka.consumer({ groupId: 'notes-group' });

// Function to process messages
const processNoteWithAI = async (note) => {
    try {
        kafka_logger.info(`🧠 Processing note → ${JSON.stringify(note)}`);
        // Example AI processing:
        // await aiService.optimize(note);
    } catch (error) {
        kafka_logger.error(`❌ Error processing note: ${error.message}`);
    }
};

// Main consumer runner
const consume = async () => {
    try {
        kafka_logger.info("🔌 Connecting Kafka Consumer...");
        await consumer.connect();
        kafka_logger.info("✅ Kafka Consumer Connected");

        await consumer.subscribe({ topic: 'notes-topic', fromBeginning: true });
        kafka_logger.info("📡 Subscribed to topic: notes-topic");

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    kafka_logger.info(`📥 Received message → ${JSON.stringify(data)} (Partition: ${partition})`);

                    await processNoteWithAI(data);
                } catch (err) {
                    kafka_logger.error(`⚠️ Error parsing/processing message: ${err.message}`);
                }
            },
        });

    } catch (error) {
        kafka_logger.error(`❌ Kafka Consumer Error: ${error.message}`);
    }
};

// Graceful shutdown
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

// Start consuming
consume();
