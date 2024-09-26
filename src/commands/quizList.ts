import { Context } from "telegraf";
import Quizzes from "../services/Quizzes";

export default function quizList(ctx: Context) {
    if (ctx.chat.type !== "private")
        return ctx.reply("Esegui questo comando in privata. Non vorrai mica rivelare i quesiti agli studenti!!!! 😡");

    const quizzes = new Quizzes(ctx.db);

    let quizListMsg = "";
    quizzes.getAll().forEach((quiz, i) => quizListMsg += `${i + 1}) ${quiz.question}\n`);
    
    ctx.reply(`Lista dei quiz\n${quizListMsg}`);
}