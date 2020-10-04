const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

const getQuote = async () => {
  try {
    const quote = await axios.get("https://api.kanye.rest?format=text");
    console.log(quote.data);
    if (typeof quote.data === "string") {
      return quote.data;
    } else throw "Missing string";
  } catch (err) {
    throw err;
  }
};

app.event("member_joined_channel", async ({ event, say }) => {
  console.log("member_joined_channel");
  console.log(event);
  if (event.channel_name === "no-hiphopheads" || event.channel === "C01BSLBV18D") {
    try {
      const quote = await getQuote();
      say(quote);
    } catch (err) {
      console.error(err);
    }
  }
});

app.command("/kanye", async ({ command, ack, say }) => {
  console.log(command);
  await ack();
  try {
    const quote = await getQuote();
    say(quote);
  } catch (err) {
    console.error(err);
  }
});

app.event("app_mention", async ({ event, message, say }) => {
  console.log(event);
  try {
    const quote = await getQuote();
    say(quote);
  } catch (err) {
    console.error(err);
  }
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
