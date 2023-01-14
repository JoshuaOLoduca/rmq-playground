import { connect } from "amqplib/callback_api.js";
import settings from "../index.js";

const exchange = "topic_logs";
const exchangeType = "topic";
const args = process.argv.slice(2);
const key = args.length >= 1 ? args[0] : "anonymous.info";
const message = args.slice(1).join(" ") || "Hello World!";

connect(settings.host, function (error0, connection) {
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
    channel.publish(exchange, key, Buffer.from(message));
    console.log(" [x] Sent %s: '%s'", message, key);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 100);
});
