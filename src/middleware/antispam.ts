import { add } from "date-fns";
import { Context } from "telegraf";

const index: {
    [chatId: number]: {
        [command: string]: {
            time: number;
            who: number[];
        };
    };
} = {};

export async function commandAntispam(ctx: Context, next: () => void) {
    if (!ctx.text?.startsWith("/")) return next();
    if (ctx.admins.includes(ctx.message.from.id)) return next(); // Admins are exempt from antispam rules

    const args = ctx.text.split(" ");
    args[0] = args[0].toLowerCase().replace("@kekkorrubot", "");
    const chatId = ctx.message.chat.id;
    const senderId = ctx.message.from.id;
    const cooldown = 5;
    const isPrivateChat = ctx.message.chat.type === "private";

    // If the chatID doesn't exist already, create an empty object
    if (!index[chatId]) index[chatId] = {};

    // If the command has been executed for the first time within the last X minutes
    if (!index[chatId][args[0]]) {
        index[chatId][args[0]] = {
            time: add(new Date(), { minutes: cooldown }).getTime(),
            who: isPrivateChat ? [] : [senderId],
        };
        return next();
    }

    const command = index[chatId][args[0]];

    // If the command has already been executed more than once within the last X minutes
    if (command.time > new Date().getTime()) {
        if (!command.who.includes(senderId)) {
            command.who.push(senderId);
            await ctx.sendMessage(
                isPrivateChat
                    ? `Hai già eseguito questo comando nel giro di ${cooldown} minuti. Leggi i messaggi precedenti o attendi prima dell'utilizo.`
                    : `Qualcuno ha già eseguito il comando <code>${args[0]}</code> nel giro di ${cooldown} minuti. Leggi i messaggi precedenti o attendi prima dell'utilizo.`,
                { parse_mode: "HTML" },
            );
        }
    } else {
        delete index[args[0]];
        return next();
    }
}
