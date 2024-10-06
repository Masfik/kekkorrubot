import overlayTextToImage from "../services/overlayTextToImage";
import Quotes from "../services/Quotes";
import Unsplash from "../services/Unsplash";
import { CommandContext } from "../telegraf";

export default async function randomQuote(ctx: CommandContext) {
    const unsplash = new Unsplash();
    const quotes = new Quotes(ctx.db);

    const randomQuote = quotes.getRandomQuote();
    if (!randomQuote)
        return ctx.reply("Non ci sono citazioni di Kekkorru disponibili.");

    await ctx.sendChatAction("upload_photo");
    await ctx.replyWithPhoto(
        {
            source: await overlayTextToImage(
                await unsplash.fetchRandomPhotoURL(),
                `${randomQuote.quote}\n- ${randomQuote.who}`,
            ),
        },
        { caption: randomQuote.caption },
    );
}
