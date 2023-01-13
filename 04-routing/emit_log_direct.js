import { connect } from "amqplib/callback_api.js";
import settings from "../index.js";

const exchange = "direct_logs";
const exchangeType = "direct";
const args = process.argv.slice(2);
const severity = args.length >= 1 ? args[0] : "info";
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
    channel.publish(exchange, severity, Buffer.from(message));
    console.log(" [x] Sent %s: '%s'", message, severity);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
