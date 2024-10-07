import overlayTextToImage from "../services/overlayTextToImage";
import Unsplash from "../services/Unsplash";
import { CommandContext } from "../telegraf";

export default async function quote(ctx: CommandContext) {
    const { quote, reply_to_message } = ctx.message;

    const unsplash = new Unsplash();

    await ctx.sendChatAction("upload_photo");
    await ctx.replyWithPhoto({
        source: await overlayTextToImage(
            await unsplash.fetchRandomPhotoURL(),
            `"${quote.text}"\n- ${reply_to_message.from.first_name}`,
        ),
    });
}
