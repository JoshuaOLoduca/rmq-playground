import amqp from "amqplib/callback_api.js";
import settings from "../index.js";

const queueName = "task_queue";
const workerId = Math.ceil(Math.random() * 1000);

// if we use object configuration, the username must be 'guest'
// If we want to use something other then guest, we must create a new user with new permissions
amqp.connect(settings.host, (error0, connection) => {
  if (error0) throw error0;
  if (connection) console.log(connection, "\nworkin in the mines");

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    // So we only recieve 1 message at a time, and will only get a new one after we ack the one we recieved
    // Setting global to true enforces the limit by combining the recieved messages on all channels for this worker
    channel.prefetch(10);

    // as a listener, we make sure the queue exists so that we dont crash if we start before the senders
    channel.assertQueue(queueName, {
      durable: true /* durable: true means queue will survive broker restart */,
      arguments: {
        "x-single-active-consumer": true, // makes it so first consumer to connect handles all requests, but if it closes, all messages get pushed to next consumer registered to channel
      },
    });

    channel.consume(
      queueName,
      async (message) => {
        const secs = message.content?.toString()?.split(".")?.length - 1 || 3;
        // Doesnt delay message retrieval
        console.log(`[${workerId}]`, "Recieved %s", message.content.toString());

        // Mimic long running task
        setTimeout(() => {
          console.log("Done: ", message.content.toString());
          channel.ack(message);
        }, 1000 * secs);
      },
      {
        noAck: false,
      }
    );
  });
});
