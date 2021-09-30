import { App } from '@slack/bolt';
import { isGenericMessageEvent } from './utils/helpers';
import SlackQueue from './slack_queue'

declare var process: {
    env: {
        BOT_TOKEN: string
        SLACK_APP_TOKEN: string
    }
}

const app = new App({
    token: process.env.BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});

let queue = new SlackQueue();

app.use(async ({ next }) => {
    // TODO: This can be improved in future versions
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await next!();
});

app.message('knock knock', async ({ message, say }) => {
    await say(`_Who's there?_`);
});

app.message(async ({ message, say }) => {
    if (!isGenericMessageEvent(message)) return;
    await say(`Hello, <@${message.user}>`);
});

app.command('/queue', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`hejhejjhej`);
});

app.action('foo', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    queue.add(body.user);
    await say({
        blocks: queue.toSlackFormatting()
    })
    // await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
    await app.start();

    console.log('⚡️ Bolt app started');

    app.client.chat.postMessage(
        {
            channel: "bot",
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Hey there!`,
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            emoji: true,
                            type: 'plain_text',
                            text: 'Join queue',
                        },
                        action_id: 'foo',
                    },
                },
            ],
            text: `Hey there!`,
        }
    );

})();