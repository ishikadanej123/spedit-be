const { WebClient } = require("@slack/web-api");

async function sendSlackNotification(message, isLeave = false) {
  const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

  const slackChannelId = isLeave
    ? process.env.SLACK_LEAVE_CHANNEL_ID
    : process.env.SLACK_CHANNEL_ID;

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
