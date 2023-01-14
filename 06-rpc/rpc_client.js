import { connect } from "amqplib/callback_api.js";
import settings from "../index.js";
import generateUuid from "./generateUuid.js";

const queueName = "rpc_queue";
const args = process.argv.slice(2);
const fibNum = args.length >= 1 ? args[0] : "2";

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

connect(settings.host, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        var correlationId = generateUuid();
        const num = parseInt(fibNum);

        console.log(" [x] Requesting fib(%d)", num);

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.properties.correlationId == correlationId) {
              console.log(" [.] Got %s", msg.content.toString());
              setTimeout(function () {
                connection.close();
                process.exit(0);
              }, 100);
            }
          },
          {
            noAck: true,
          }
        );

        channel.sendToQueue(queueName, Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      }
    );
  });
});
