import amqp from "amqplib/callback_api.js";

const queueName = "hello";

// if we use object configuration, the username must be 'guest'
// If we want to use something other then guest, we must create a new user with new permissions
amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) throw error0;
  if (connection) console.log(connection, "\nWe are here");

  connection.createChannel((error1, channel) => {
    if (error1) throw error1;

    // as a listener, we make sure the queue exists so that we dont crash if we start before the senders
    channel.assertQueue(queueName, {
      durable: false /* durable: true means queue will survive broker restart */,
    });

    channel.consume(
      queueName,
      async (message) => {
        // Doesnt delay message retrieval
        await new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 2000);
        });
        console.log("Recieved %s", message.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
