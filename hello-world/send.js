import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", (error0, connection) => {
  if (error0) console.error(error0);
  if (connection) console.log(connection);
});
