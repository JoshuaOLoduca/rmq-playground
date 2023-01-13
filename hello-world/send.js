import amqp from "amqplib/callback_api.js";
import settings from "..";

const queueName = "hello";
const message = "hello world";
const messagesToSend = 100;

// if we use object configuration, the username must be 'guest'
// If we want to use something other then guest, we must create a new user with new permissions
amqp.connect(settings.host, (error0, connection) => {
  if (error0) throw error0;
  if (connection) console.log(connection, "\nWe're in");

  connection.createChannel(async (error1, channel) => {
    if (error1) throw error1;

    channel.assertQueue(queueName, {
      durable: false /* durable: true means queue will survive broker restart */,
    });

    for (let i = 0; i < messagesToSend; i++) {
      const newMessage = message + ": " + Math.ceil(Math.random() * 1000);

      // queues message to be recieved by ./recieve.js
      channel.sendToQueue(queueName, Buffer.from(newMessage));
      console.log("Sent %s", newMessage);
      // await new Promise((resolve, reject) => {
      //   setTimeout(resolve, 100);
      // });
    }

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
