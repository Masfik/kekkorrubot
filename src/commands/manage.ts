import Quizzes from "../services/Quizzes";
import Quotes from "../services/Quotes";
import { CommandContext } from "../telegraf";

export default async function manage(ctx: CommandContext) {
    const quizzes = new Quizzes(ctx.db);
    const quotes = new Quotes(ctx.db);

    const quizQuantity = `✍️ <b>Quantità di quiz:</b> ${quizzes.getAll().length}`;
    const quotesQuantity = `💭 <b>Citazioni di Kekkorru:</b> ${quotes.getAll().length}`;

    ctx.reply(
        `Ciao master ${ctx.from.first_name}. ` +
            `Qui potrai modificare e visualizzare le impostazioni del bot.\n` +
            `<b>Dev mode = ${process.env.DEVMODE}</b>\n\n` +
            `${quizQuantity}\n` +
            `${quotesQuantity}\n`,
        { parse_mode: "HTML" },
    );
}
