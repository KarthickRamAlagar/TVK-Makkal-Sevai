// Kafka Client in Frontend

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "tvk-frontend",
  brokers: ["your-broker-url:9092"], // Redpanda or Confluent
});

export const producer = kafka.producer();
