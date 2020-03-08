import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistInhibitor extends Inhibitor {
  public constructor() {
    super("inhibitors-blacklist", {
      reason: "blacklist"
    });
  }

  public exec(message: Message): Promise<any> {
    let blacklist = this.client.settings.get("global", "all.blacklist", []);

    return blacklist.includes(message.author.id);
  }
}
