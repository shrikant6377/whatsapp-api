const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;
// console.log(authToken);
const client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/send">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name"><br>

      <label for="phoneId">Phone ID:</label>
      <input type="text" id="phoneId" name="phoneId"><br>

      <label for="tokenId">Token ID:</label>
      <input type="text" id="tokenId" name="tokenId"><br>

      <label for="phoneNumber">Phone Number:</label>
      <input type="text" id="phoneNumber" name="phoneNumber"><br>

      <label for="template">Template:</label>
      <select id="template" name="template">
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
        <option value="template3">Template 3</option>
      </select><br>

      <button type="submit">Send</button>
    </form>
  `);
});

app.post('/sendmessage', (req, res) => {
  const { name, phoneId, tokenId, phoneNumber, template } = req.body;

  client.messages.create({
    from: `whatsapp:${phoneId}`,
    to: `whatsapp:${phoneNumber}`,
    body: `Hello ${name}, this is your ${template} message.`,
    messagingServiceSid: tokenId
  }).then(() => {
    res.send(`
      <h1>Message sent successfully!</h1>
      <p>Name: ${name}</p>
      <p>Phone ID: ${phoneId}</p>
      <p>Token ID: ${tokenId}</p>
      <p>Phone Number: ${phoneNumber}</p>
      <p>Template: ${template}</p>
    `);
  }).catch(error => {
    console.error(error);
    res.send(`
      <h1>Failed to send message!</h1>
      <p>Error message: ${error.message}</p>
    `);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
