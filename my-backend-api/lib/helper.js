const { WebClient } = require("@slack/web-api");

async function sendSlackNotification(message) {
  const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

  const slackChannelId = process.env.SLACK_CHANNEL_ID;

  try {
    await slackClient.chat.postMessage({
      channel: slackChannelId,
      text: message,
    });
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}

module.exports = { sendSlackNotification };
