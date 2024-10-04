import { Telegraf } from "telegraf";
import Loki from "lokijs";
import GroupManagementService from "../services/GroupManagementService";
import Quizzes from "../services/Quizzes";

export default function randomQuiz(bot: Telegraf, db: Loki) {
    const quizzes = new Quizzes(db);
    const randomQuiz = quizzes.getRandomQuiz();

    // When there are no quiz available
    if (!randomQuiz) return;

    const groupManagement = new GroupManagementService(db);
    groupManagement.getAllAllowedGroupIDs().forEach(async (id) => {
        await bot.telegram.sendQuiz(
            id,
            randomQuiz.question,
            randomQuiz.options,
            {
                correct_option_id: randomQuiz.correct_option_id,
                is_anonymous: false,
            },
        );
        await bot.telegram.sendMessage(
            id,
            "È l'ora di fare un quiz su Kekkorru! Hip hip urrà! 😊",
        );
    });
}
