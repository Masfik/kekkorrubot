import { Context } from "telegraf";
import { CommandContext } from "../telegraf";

export default function isQuote(ctx: CommandContext, next: () => void) {
    if (!ctx.message.quote)
        return ctx.reply(
            "Devi quotare la parte di messaggio che vuoi trasformare in citazione.",
        );
    return next();
}
