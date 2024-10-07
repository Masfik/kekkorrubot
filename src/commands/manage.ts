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
            `${quotesQuantity}\n\n\n` +
            `🛡️ <b>Comandi Admin</b>\n` +
            `\/adquiz - aggiungi un nuovo quiz\n` +
            `\/quizlist - lista quiz\n` +
            `\/deletequiz id - elimina quiz specificato\n` +
            `\/adquote - aggiungi una nuova citazione\n` +
            `\/quotes - lista delle citazioni\n` +
            `\/deletequote id - elimina la citazione specificata\n` +
            `\/allowgroup - esegui questo comando nel gruppo che vuoi autorizzare ad utilizzare i quiz e shipping`,
        { parse_mode: "HTML" },
    );
}
