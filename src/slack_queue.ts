import { Block, KnownBlock } from "@slack/web-api";
import { User } from '@slack/web-api/dist/response/UsersIdentityResponse';
import Queue from "./queue";

export default class SlackQueue extends Queue<User> {
    removeUser(user: { id: string; name: string; team_id?: string; } | { id: string; username: string; team_id?: string; } | { id: string; name: string; team_id?: string; } | { id: string; name: string; team_id?: string; }) {
        let node = this.head;

        if (this.head.getObj().id === user.id) {
            this.head = this.head.getNext();
        }

        while (node.getNext() !== null) {
            if (node.getNext().getObj().id === user.id) {
                //remove
                node.setNext(node.getNext().getNext());
                return;
            }
            node = node.getNext();
        }

    }
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
    toSlackFormatting = (action?: string): (Block | KnownBlock)[] => {
        let list = this.toList();
        let blocks: (Block | KnownBlock)[] = [];

        if (action) {
            blocks.push(
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `${action}`,
                    },
                }
            );
        }


        blocks.push(
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Current queue status`,
                },
            }
        );
        list.forEach((element, index) => {
            blocks.push(this.createBlockFromElement(element, index + 1))
        });

        blocks.push({
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
        })

        return blocks;
    }
}