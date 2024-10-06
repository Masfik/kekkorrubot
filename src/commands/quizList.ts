import { Context } from "telegraf";
import Quizzes from "../services/Quizzes";

export default function quizList(ctx: Context) {
    if (ctx.chat.type !== "private")
        return ctx.reply(
            "Esegui questo comando in privata. Non vorrai mica rivelare i quesiti agli studenti!!!! 😡",
        );

    const quizzes = new Quizzes(ctx.db);

    let quizListMsg = "";
    quizzes
        .getAll()
        .forEach(
            (quiz, i) =>
                (quizListMsg += `<b>${i + 1})</b> ${quiz.question}\n     <b>ID:</b> <code>${quiz.id}</code>\n\n`),
        );

    ctx.reply(`✍️ <b>Lista dei quiz</b>\n\n${quizListMsg}`, {
        parse_mode: "HTML",
    });
}
