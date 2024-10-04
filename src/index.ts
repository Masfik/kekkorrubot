import "dotenv/config";
import { Scenes, Telegraf, session } from "telegraf";
import Loki from "lokijs";
import quote from "./commands/quote";
import randomQuote from "./commands/randomQuote";
import manage from "./commands/manage";
import onMessage from "./events/onMessage";
import isAdmin from "./middleware/isAdmin";
import initialiseDatabase from "./services/initialiseDatabase";
import { addQuizCommand, addQuizScene } from "./commands/addQuiz";
import { Stage } from "telegraf/scenes";
import quizList from "./commands/quizList";
import randomQuiz from "./events/scheduled.randomQuiz";
import allowGroup from "./commands/allowGroup";
import schedule from "node-schedule";
import dailyShipping from "./events/scheduled.dailyShipping";

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN);
const db = new Loki("KekkorruBot.db", {
    autoload: true,
    autoloadCallback: () => initialiseDatabase(db),
    autosave: true,
    autosaveInterval: 4000,
});
// Add db instance to context
bot.use((ctx, next) => {
    ctx.db = db;
    return next();
});
// Add admins to context
bot.use((ctx, next) => {
    ctx.admins = [
        113274582, // Masfik
        6932054019, // Wykeeki
        153655894, // Kekkorru
    ];
    return next();
});
bot.use(session());
// Register all scenes (step by step commands)
bot.use(new Stage([addQuizScene], { ttl: 120 }).middleware());

// All commands
bot.command("quote", quote);
bot.command("randomquote", randomQuote);
bot.command("manage", isAdmin, manage);
bot.command("addquiz", isAdmin, addQuizCommand);
bot.command(/quizlist|listquiz|listaquiz/s, isAdmin, quizList);
bot.command("allowgroup", isAdmin, allowGroup);
// Events
bot.on("message", onMessage);

bot.launch().then(() => console.info("Avviato!"));

// Scheduled events
schedule.scheduleJob("shipping", "30 59 23 * * *", () =>
    dailyShipping(bot, db),
);
schedule.scheduleJob("quiz15", "0 0 15 * * *", () => randomQuiz(bot, db));
schedule.scheduleJob("quiz17", "0 0 17 * * *", () => randomQuiz(bot, db));
schedule.scheduleJob("quiz19", "0 0 19 * * *", () => randomQuiz(bot, db));
schedule.scheduleJob("quiz21", "0 0 21 * * *", () => randomQuiz(bot, db));

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
