// kafkaSetup.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'],
});

// Admin client to manage topics
const admin = kafka.admin();
const producer = kafka.producer();

const TOPIC = 'notes-topic';
const PARTITIONS = 3;
const REPLICATION_FACTOR = 1;

const setupKafka = async () => {
    try {
        // Connect admin
        await admin.connect();

        // Create topic with partitions
        const created = await admin.createTopics({
            topics: [
                {
                    topic: TOPIC,
                    numPartitions: PARTITIONS,
                    replicationFactor: REPLICATION_FACTOR,
                },
            ],
        });

        if (created) {
            console.log(`Topic "${TOPIC}" created with ${PARTITIONS} partitions.`);
        } else {
            console.log(`Topic "${TOPIC}" already exists.`);
        }

        // Describe topic
        const topicMetadata = await admin.fetchTopicMetadata({ topics: [TOPIC] });
        console.log('Topic metadata:', JSON.stringify(topicMetadata, null, 2));

        await admin.disconnect();

        // Connect producer once (API will reuse this producer)
        await producer.connect();
        console.log("Kafka producer connected and ready to use.");

    } catch (error) {
        console.error('Error setting up Kafka:', error);
        await admin.disconnect();
        await producer.disconnect();
    }
};

// Export producer to use in your API
export { producer, setupKafka, TOPIC };
