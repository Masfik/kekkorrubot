import { SceneContext } from "telegraf/scenes";

export default function annullaCommand(ctx: SceneContext) {
    ctx.scene.leave();
    ctx.reply("Operazione annullata.");
}
