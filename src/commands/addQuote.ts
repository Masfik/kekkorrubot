import { BaseScene, SceneContext } from "telegraf/scenes";
import isAdmin from "../middleware/isAdmin";
import annullaCommand from "../middleware/scenes/annullaCommand";
import Quotes from "../services/Quotes";

export const addQuoteSceneStep1 = new BaseScene<SceneContext>("ADD_QUOTE_1");
addQuoteSceneStep1.enter((ctx) =>
    ctx.reply(
        "Okay, inviami la citazione in questione da aggiungere.\n\n" +
            "Digita /annulla qualora volessi annullare l'operazione.",
    ),
);
addQuoteSceneStep1.command("annulla", isAdmin, annullaCommand);
addQuoteSceneStep1.on("message", (ctx) => {
    if (!ctx.text) return ctx.reply("Puoi inviare solo messaggi di testo.");
    ctx.session["quote"] = ctx.text;
    ctx.scene.enter("ADD_QUOTE_2");
});

export const addQuoteSceneStep2 = new BaseScene<SceneContext>("ADD_QUOTE_2");
addQuoteSceneStep2.enter((ctx) =>
    ctx.reply(
        `Okay, inviami la didascalia da aggiungere alla citazione indicata.\n\n"${ctx.session["quote"]}"`,
    ),
);
addQuoteSceneStep2.command("annulla", isAdmin, annullaCommand);
addQuoteSceneStep2.on("message", async (ctx) => {
    if (!ctx.text) return ctx.reply("Puoi inviare solo messaggi di testo.");

    const quotes = new Quotes(ctx.db);
    quotes.addQuote({
        id: ctx.msgId,
        quote: `"${ctx.session["quote"]}"`,
        caption: ctx.text,
        who: "Kekkorru",
    });

    await ctx.scene.leave();
    await ctx.reply(
        "Aggiunta nuova citazione di Kekkorru. Grazie per il tuo servizio.",
    );
});

export default function addQuote(ctx: SceneContext) {
    ctx.scene.enter("ADD_QUOTE_1");
}
