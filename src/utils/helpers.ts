import {
  GenericMessageEvent,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
} from '@slack/bolt';
import { AuthTestResponse, ChatPostMessageArguments, WebClient } from '@slack/web-api';

export const isGenericMessageEvent = (msg: MessageEvent):
  msg is GenericMessageEvent => (msg as GenericMessageEvent).subtype === undefined;

export const isMessageItem = (item: ReactionAddedEvent['item']):
  item is ReactionMessageItem => (item as ReactionMessageItem).type === 'message';



export const sendOrUpdateLastMessage = async (bot_info: AuthTestResponse, client: WebClient, args: ChatPostMessageArguments): Promise<any> => {
  let lastMessage = await client.conversations.history({
    channel: args.channel,
    limit: 1
  })

  if (lastMessage.messages[0].bot_id === bot_info.bot_id) {
    // update
    // await client.chat.update({
    //   channel: args.channel,
    //   ts: lastMessage.messages[0].ts,
    //   ... args
    // })
    // return;
    client.chat.delete({
      channel: args.channel,
      ts: lastMessage.messages[0].ts
    })
  }
  client.chat.postMessage(args);
}