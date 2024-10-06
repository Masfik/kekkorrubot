import { Context } from "telegraf";
import Quotes from "../services/Quotes";

export default function quoteList(ctx: Context) {
    const quotes = new Quotes(ctx.db);
    const all = quotes.getAll();

    if (all.length === 0)
        return ctx.reply("Non ci sono citazioni di Kekkorru.");

    let quotesListMsg = "";
    all.forEach(
        (quote, i) =>
            (quotesListMsg += `<b>${i + 1})</b> ${quote.quote}\n     <b>ID:</b> <code>${quote.id}</code>\n\n`),
    );

    ctx.reply("💭 <b>Lista citazioni</b>\n\n" + quotesListMsg, {
        parse_mode: "HTML",
    });
}
