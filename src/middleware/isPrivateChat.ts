import { Context } from "telegraf";

export default function isPrivateChat(ctx: Context, next: () => void) {
    if (ctx.chat.type !== "private")
        return ctx.reply("Per favore, esegui questo comando in privata.");
    next();
}
