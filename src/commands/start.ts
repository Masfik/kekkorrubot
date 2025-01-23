import { Context } from "telegraf";

export default function start(ctx: Context) {
    ctx.replyWithHTML(
        "Benvenuto in <b>maualebot</b>. Cordiali saluti!!!!!!!!!!!!\n\n" +
            "Se sei interessato, il codice sorgente del bot si trova qui: https://github.com/Masfik/maualebot",
    );
}
