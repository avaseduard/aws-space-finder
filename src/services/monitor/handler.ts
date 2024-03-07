import { SNSEvent } from 'aws-lambda';

const webHookUrl = 'slack-webhook-url';

async function handler(event: SNSEvent, context) {
  for (const record of event.Records) {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `Houston, we've got a problem: ${record.Sns.Message}`,
      }),
    });
  }
}

export { handler };
