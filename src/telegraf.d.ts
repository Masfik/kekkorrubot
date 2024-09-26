import Loki from 'lokijs';
import { Context, NarrowedContext, Scenes } from 'telegraf';
import { Message, Update } from 'telegraf/types';

declare module "telegraf" {
    export interface Context {
        admins: number[];
        db: Loki;
    }
}

export type CommandContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}>;

export type MessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>;
