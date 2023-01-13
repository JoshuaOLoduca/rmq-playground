import amqp from "amqplib/callback_api.js";

const queueName = "hello";
const message = "hello world: " + Math.ceil(Math.random() * 1000);

// if we use object configuration, the username must be 'guest'
// If we want to use something other then guest, we must create a new user with new permissions
amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;
  if (connection) console.log(connection, "\nWe're in");

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    channel.assertQueue(queueName, {
      durable: false /* durable: true means queue will survive broker restart */,
    });

    // queues message to be recieved by ./recieve.js
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("Sent %s", message);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
