import amqp from "amqplib/callback_api.js";
import settings from "../index.js";

const queueName = "task_queue";
const message = process.argv.slice(2).join(" ") || "hello world.";

// if we use object configuration, the username must be 'guest'
// If we want to use something other then guest, we must create a new user with new permissions
amqp.connect(settings.host, (error0, connection) => {
  if (error0) throw error0;
  if (connection) console.log(connection, "\nWe're in");

  connection.createChannel(async (error1, channel) => {
    if (error1) throw error1;

    channel.assertQueue(queueName, {
      durable: true /* durable: true means queue will survive broker restart */,
    });

    // queues message to be recieved by ./recieve.js
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log("Sent %s", message);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 100);
  });
});
