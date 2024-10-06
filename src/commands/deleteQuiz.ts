import { Context } from "telegraf";
import Quizzes from "../services/Quizzes";

export default function deleteQuiz(ctx: Context) {
    const args = ctx.text.split(" ");

    if (args.length === 1)
        return ctx.reply(
            "Per favore, inserisci l'ID del quiz che vuoi eliminare accanto al comando.\n\n" +
                "<b>Esempio:</b> <code>/deletequiz 123456789</code>",
            { parse_mode: "HTML" },
        );

    const quizzes = new Quizzes(ctx.db);

    try {
        quizzes.deleteQuiz(args[1]);
        ctx.reply("Quiz eliminato con successo.");
    } catch (e) {
        ctx.reply(
            "Si è verificato un errore con l'ID specificato. Per favore controlla che sia corretto con /quizlist.",
        );
    }
}
