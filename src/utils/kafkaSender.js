// // utils/kafkaSender.js
// import { producer } from "./kafkaClient";

// export const sendReduxPayloadToKafka = async (reduxState) => {
//   try {
//     await producer.connect();
//     await producer.send({
//       topic: "tvkFullSync",
//       messages: [{ value: JSON.stringify(reduxState) }],
//     });
//     console.log("📤 Redux payload sent to Kafka");
//   } catch (err) {
//     console.error("❌ Kafka send failed:", err);
//   }
// };
