import GroupManagementService from "../services/GroupManagementService";
import { CommandContext } from "../telegraf";

export default function allowGroup(ctx: CommandContext) {
    if (ctx.chat.type === "private")
        return ctx.reply("Puoi eseguire questo comando solo in un gruppo.");

    const groupManagement = new GroupManagementService(ctx.db, ctx.chat.id);
    groupManagement.addToAllowed(ctx.chat.title);

    ctx.reply("Gruppo aggiunto alla whitelist con successo.");
}
