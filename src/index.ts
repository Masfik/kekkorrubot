import 'dotenv/config';
import { Scenes, Telegraf, session } from 'telegraf';
import Loki from 'lokijs';
import quote from './commands/quote';
import randomQuote from './commands/randomQuote';
import manage from './commands/manage';
import onMessage from './events/onMessage';
import isAdmin from './middleware/isAdmin';
import initialiseDatabase from './services/initialiseDatabase';
import { addQuizCommand, addQuizScene } from './commands/addQuiz';
import { Stage } from 'telegraf/scenes';
import quizList from './commands/quizList';
import randomQuiz from './commands/randomQuiz';

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN);
const db = new Loki('KekkorruBot.db', {
    autoload: true,
	autoloadCallback: () => initialiseDatabase(db),
	autosave: true,
	autosaveInterval: 4000
});
// Add db instance to context
bot.use((ctx, next) => { ctx.db = db; return next(); });
// Add admins to context
bot.use((ctx, next) => {
    ctx.admins = [
        113274582, // Masfik
        6932054019, // Wykeeki
    ];
    return next();
});
bot.use(session());
// Register all scenes (step by step commands)
bot.use(
    new Stage(
        [addQuizScene],
        { ttl: 120 }
    ).middleware()
);

// All commands
bot.command('quote', quote);
bot.command('randomquote', randomQuote);
bot.command('manage', isAdmin, manage);
bot.command("addquiz", isAdmin, addQuizCommand);
bot.command(/quizlist|listquiz|listaquiz/s, isAdmin, quizList);
bot.command("randomquiz", randomQuiz);
// Events
bot.on("message", onMessage);

bot.launch().then(() => console.info("Avviato!"))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
