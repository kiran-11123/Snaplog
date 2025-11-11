// kafkaConsumer.js
import { Kafka } from 'kafkajs';

// Initialize Kafka client
const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'], // replace with your Kafka broker(s)
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'notes-group' });

// Function to process incoming messages
const processNoteWithAI = async (note) => {
    try {
        // Example: Trigger AI optimization, analytics, or other processing
        console.log("Processing note:", note);
        // await aiService.optimize(note);
    } catch (error) {
        console.error('Error processing note:', error);
    }
};

// Main consumer function
const consume = async () => {
    try {
        // Connect to Kafka
        await consumer.connect();
        console.log("Kafka consumer connected.");

        // Subscribe to the topic
        await consumer.subscribe({ topic: 'notes-topic', fromBeginning: true });
        console.log("Subscribed to notes-topic.");

        // Run consumer
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    console.log("Received Kafka message:", data);
                    await processNoteWithAI(data);
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
