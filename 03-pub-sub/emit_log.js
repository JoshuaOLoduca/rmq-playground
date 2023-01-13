import { connect } from "amqplib/callback_api.js";
import settings from "../index.js";

const exchange = "logs";
const message = process.argv.slice(2).join(" ") || "Hello World!";

connect(settings.host, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });
    channel.publish(exchange, "", Buffer.from(message));
    console.log(" [x] Sent %s", message);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
