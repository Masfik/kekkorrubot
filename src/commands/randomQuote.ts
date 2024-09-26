import overlayTextToImage from "../services/overlayTextToImage";
import getRandomQuote from "../services/Quotes";
import Unsplash from "../services/Unsplash";
import { CommandContext } from "../telegraf";

export default async function randomQuote(ctx: CommandContext) {
    const unsplash = new Unsplash();

    const randomQuote = getRandomQuote(
        ctx.db.getCollection<{ quote: string; caption: string }>("quotes"),
    );
    if (!randomQuote)
        return ctx.reply("Non ci sono citazioni di Kekkorru disponibili.");

    await ctx.sendChatAction("upload_photo");
    await ctx.replyWithPhoto(
        {
            source: await overlayTextToImage(
                await unsplash.fetchRandomPhotoURL(),
                randomQuote.quote,
            ),
        },
        { caption: randomQuote.caption },
    );
}
