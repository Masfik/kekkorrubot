import { Telegraf } from "telegraf";
import Loki from "lokijs";
import GroupManagementService from "../services/GroupManagementService";

export default function dailyShipping(bot: Telegraf, db: Loki) {
    const groupManagement = new GroupManagementService(db);
    groupManagement.getAllAllowedGroupIDs().forEach((id) => {
        const shippingService = new GroupManagementService(db, id);

        try {
            const chosenOne = shippingService.generateShipping();
            bot.telegram.sendMessage(
                id,
                `👩‍❤️‍💋‍👨 <b>La coppia del giorno è stata scelta!</b>\n\n<a href="tg://user?id=${chosenOne.id}">${chosenOne.first_name}</a> + <a href="tg://user?id=${GroupManagementService.Kekkorru.id}">Kekkorru</a>`,
                { parse_mode: "HTML" },
            );
        } catch (e) {
            bot.telegram.sendMessage(id, e.message);
        }
    });
}
