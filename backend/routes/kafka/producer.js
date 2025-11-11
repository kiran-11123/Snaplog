// kafkaSetup.js
import { Kafka } from 'kafkajs';
import logger from "../../utils/logger.js"; // <-- add this

const kafka = new Kafka({
    clientId: 'notes-app',
    brokers: ['localhost:9092'],
});

const admin = kafka.admin();
const producer = kafka.producer();

const TOPIC = 'notes-topic';
const PARTITIONS = 3;
const REPLICATION_FACTOR = 1;

const setupKafka = async () => {
    try {
        logger.info("⚙️ Connecting Kafka Admin...");
        await admin.connect();

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
            logger.info(`✅ Topic "${TOPIC}" created with ${PARTITIONS} partitions.`);
        } else {
            logger.info(`ℹ️ Topic "${TOPIC}" already exists.`);
        }

        const topicMetadata = await admin.fetchTopicMetadata({ topics: [TOPIC] });
        logger.info(`📄 Topic metadata: ${JSON.stringify(topicMetadata, null, 2)}`);

        await admin.disconnect();
        logger.info("🔌 Kafka Admin disconnected.");

        logger.info("🚀 Connecting Kafka Producer...");
        await producer.connect();
        logger.info("✅ Kafka Producer is ready to send messages.");

    } catch (error) {
        logger.error(`❌ Kafka Setup Error: ${error.message}`);
        try { await admin.disconnect(); } catch {}
        try { await producer.disconnect(); } catch {}
    }
};

// Export producer and topic for use in API
export { producer, setupKafka, TOPIC };
