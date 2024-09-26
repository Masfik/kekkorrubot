import { BaseScene, SceneContext } from "telegraf/scenes";
import isAdmin from "../middleware/isAdmin";
import { Update } from "telegraf/types";
import Quizzes from "../services/Quizzes";

export const addQuizScene = new BaseScene<SceneContext>("ADD_QUIZ");
addQuizScene.enter((ctx) => ctx.reply("Okay, inviami il quiz in questione da aggiungere."));
addQuizScene.on("poll", isAdmin, async (ctx) => {
    const { poll } = ctx.message as Update.PollUpdate;
    if (poll.type !== "quiz")
        return ctx.reply("Puoi inviarmi solo quiz, questo è un sondaggio.");

    const quizzes = new Quizzes(ctx.db)
    quizzes.addQuiz({
        id: poll.id,
        question: poll.question,
        options: poll.options.map((option) => option.text),
        correct_option_id: poll.correct_option_id,
    });
    ctx.scene.leave();
    await ctx.reply(`Aggiunto nuovo quiz "${poll.question}"`);
});
addQuizScene.command("annulla", isAdmin, async (ctx) => {
    ctx.scene.leave();
    ctx.reply("Operazione annullata.");
})
addQuizScene.on("message", isAdmin, (ctx) => ctx.reply("Puoi inviare solo quiz, non altri tipi di messaggio."));

export async function addQuizCommand(ctx: SceneContext) {
    if (ctx.chat.type !== 'private')
        return ctx.reply("Per favore, esegui questo comando in privata.");
    ctx.scene.enter("ADD_QUIZ");
}