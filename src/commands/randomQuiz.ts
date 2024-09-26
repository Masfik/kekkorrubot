import Quizzes from "../services/Quizzes";
import { CommandContext } from "../telegraf";

export default function randomQuiz(ctx: CommandContext) {
    const quizzes = new Quizzes(ctx.db);
    const randomQuiz = quizzes.getRandomQuiz();

    if (!randomQuiz)
        return ctx.reply(
            "Non ci sono quiz disponibili. Devono essere aggiunti da un admin di KekkorruBot.",
        );

    ctx.sendQuiz(randomQuiz.question, randomQuiz.options, {
        correct_option_id: randomQuiz.correct_option_id,
        is_anonymous: false,
    });
}
