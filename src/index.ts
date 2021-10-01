import { App } from '@slack/bolt';
import { isGenericMessageEvent, sendOrUpdateLastMessage } from './utils/helpers';
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

let bot_info = null;
let queue = new SlackQueue();
let channel = 'C02GTR8BH24';

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
    app.client.chat.postEphemeral({
        user: message.user,
        channel: "bot",
        blocks: queue.toSlackFormatting()
    });
    console.log(message.channel);
    await say(`Hello, <@${message.user}>`);
});

app.command('/queue', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();

    await respond(`hejhejjhej`);
});

app.action('join-queue', async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack();
    queue.add(body.user);
    await sendOrUpdateLastMessage(
        bot_info,
        app.client,
        { channel: channel, blocks: queue.toSlackFormatting(`<@${body.user.id}> has joined the queue.`) }
    );

});

app.action('leave-queue', async ({ body, ack, say }) => {
    await ack();
    queue.removeUser(body.user);
    await sendOrUpdateLastMessage(
        bot_info,
        app.client,
        { channel: channel, blocks: queue.toSlackFormatting(`<@${body.user.id}> has joined the queue.`) }
    );

});

(async () => {
    await app.start();

    bot_info = await app.client.auth.test();

    console.log('⚡️ Bolt app started');

    console.log(`BottyInfo ${JSON.stringify(await app.client.auth.test())}`);




    app.client.chat.postMessage(
        {
            channel: "bot",
            blocks: [
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                emoji: true,
                                type: 'plain_text',
                                text: 'Join queue',
                            },
                            action_id: 'join-queue',
                        },
                        {
                            type: 'button',
                            text: {
                                emoji: true,
                                type: 'plain_text',
                                text: 'Leave queue',
                            },
                            action_id: 'leave-queue',
                        }
                    ]
                },
            ],
            text: `Hey there!`,
        }
    );

})();