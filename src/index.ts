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
import addQuote, {
    addQuoteSceneStep1,
    addQuoteSceneStep2,
} from "./commands/addQuote";
import isPrivateChat from "./middleware/isPrivateChat";
import deleteQuiz from "./commands/deleteQuiz";
import quoteList from "./commands/quoteList";
import deleteQuote from "./commands/deleteQuote";
import { commandAntispam } from "./middleware/antispam";
import isQuote from "./middleware/isQuote";

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
bot.use(
    new Stage([addQuizScene, addQuoteSceneStep1, addQuoteSceneStep2], {
        ttl: 120,
    }).middleware(),
);

// All commands
bot.command("quote", isQuote, commandAntispam, quote);
bot.command("randomquote", commandAntispam, randomQuote);
bot.command("addquote", isPrivateChat, isAdmin, addQuote);
bot.command(
    /quoteslist|quotelist|listacitazioni|quotes|listquotes|listquote/s,
    isPrivateChat,
    isAdmin,
    quoteList,
);
bot.command("deletequote", isPrivateChat, isAdmin, deleteQuote);
bot.command("manage", isAdmin, manage);
bot.command("addquiz", isPrivateChat, isAdmin, addQuizCommand);
bot.command("deletequiz", isPrivateChat, isAdmin, deleteQuiz);
bot.command(/quizlist|listquiz|listaquiz/s, isAdmin, quizList);
bot.command("allowgroup", isAdmin, allowGroup);
// Events
bot.on("message", onMessage);

bot.launch().then(() => {
    bot.telegram.sendMessage(
        bot.context.admins![0],
        "Bot avviato con successo!",
    );
});

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
