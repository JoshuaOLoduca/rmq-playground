import amqp from "amqplib/callback_api.js";
import settings from "../index.js";

const exchange = "topic_logs";
const exchangeType = "topic";
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect(settings.host, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(exchange, exchangeType, {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue
        );

        args.forEach((key) => channel.bindQueue(q.queue, exchange, key));

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(
                " [x] %s: '%s'",
                msg.fields.routingKey,
                msg.content.toString()
              );
            }
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
