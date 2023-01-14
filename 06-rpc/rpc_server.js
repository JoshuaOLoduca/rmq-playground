import amqp from "amqplib/callback_api.js";
import settings from "../index.js";
import fibonacci from "./fibonacci.js";

const queueName = "rpc_queue";

amqp.connect(settings.host, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queueName, {
      durable: true,
    });
    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests");

    channel.consume(queueName, function reply(msg) {
      const n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      const r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId,
      });

      channel.ack(msg);
    });
  });
});
