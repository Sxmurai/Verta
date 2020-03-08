import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class GuildInhibitor extends Inhibitor {
  public constructor() {
    super("inhibitors-guild", {
      reason: "Blacklisted Guild"
    });
  }

  public exec(message: Message): Promise<any> {
    let blacklist = this.client.settings.get(
      "global",
      "all.guildblacklist",
      []
    );

    if (!message.guild) return;

    return blacklist.includes(message.guild.id);
  }
}
