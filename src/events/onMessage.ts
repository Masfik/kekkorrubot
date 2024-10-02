import GroupManagementService from "../services/GroupManagementService";
import { MessageContext } from "../telegraf";

export default async function onMessage(ctx: MessageContext) {
    if (ctx.message.chat.type === "private") return;
    const groupManagement = new GroupManagementService(
        ctx.db,
        ctx.message.chat.id,
    );
    if (!groupManagement.isAllowed()) return;

    // Creates a new collection of the day (if non-existent) and deletes the previous
    groupManagement.dailySetup();
    // Inserts only actives users of the day to the collection
    groupManagement.addUserIfNonExistent({
        id: ctx.message.from.id,
        first_name: ctx.message.from.first_name,
    });
}
