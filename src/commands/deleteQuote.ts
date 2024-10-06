import { Context } from "telegraf";
import Quotes from "../services/Quotes";

export default function deleteQuote(ctx: Context) {
    const args = ctx.text.split(" ");

    if (args.length === 1)
        return ctx.reply(
            "Per favore, inserisci l'ID della citazione che vuoi eliminare accanto al comando.\n\n" +
                "<b>Esempio:</b> <code>/deletequote 123456789</code>",
            { parse_mode: "HTML" },
        );

    const quotes = new Quotes(ctx.db);
    try {
        quotes.deleteQuote(Number.parseInt(args[1]));
        ctx.reply("Citazione eliminata con successo.");
    } catch (e) {
        ctx.reply(
            "Si è verificato un errore con l'ID specificato. Per favore controlla che sia corretto con /quoteslist.",
        );
    }
}
