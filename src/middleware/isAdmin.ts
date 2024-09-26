import { Context } from "telegraf";

export default function isAdmin(ctx: Context, next: () => void) {
    if (ctx.admins.includes(ctx.from.id)) return next();
}
