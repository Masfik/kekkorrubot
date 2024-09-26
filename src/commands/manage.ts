import { CommandContext } from "../telegraf";

export default async function manage(ctx: CommandContext) {
    ctx.reply(
        `Ciao master ${ctx.from.first_name}. Qua potrai modificare le impostazioni del bot.\n**Dev mode = ${process.env.DEVMODE}**`,
        { parse_mode: "Markdown" },
    );
}
