import { Block, KnownBlock } from "@slack/web-api";
import { User } from '@slack/web-api/dist/response/UsersIdentityResponse';
import Queue from "./queue";

export default class SlackQueue extends Queue<User> {
    createBlockFromElement(user: User, idx: number): Block | KnownBlock {
        let position = this.getPositionString(idx);

        return {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `${position} <@${user.id}>`,
            },
        }
    }
    getPositionString(idx: number) {
        if (idx === 1) {
            return `:first_place_medal:`;
        }
        if (idx === 2) {
            return `:second_place_medal:`;
        }
        if (idx === 3) {
            return `:third_place_medal:`;
        }
        return `${idx}`;
    }
    toSlackFormatting = (): (Block | KnownBlock)[] => {
        let list = this.toList();
        let blocks: (Block | KnownBlock)[] = [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Current queue status`,
                },
            }
        ];
        list.forEach((element, index) => {
            blocks.push(this.createBlockFromElement(element, index + 1))
        });

        return blocks;
    }
}