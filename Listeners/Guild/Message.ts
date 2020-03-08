import { Listener } from "discord-akairo";
import { Message } from "discord.js";

import VertaXPSystem from "../../Client/Struct/XPSystem";

export default class MessageListener extends Listener {
  public constructor() {
    super("message", {
      emitter: "client",
      event: "message"
    });
  }

  public async exec(message: Message) {
    const xpSystem = new VertaXPSystem(this.client);

    await xpSystem.generateXP(message);
  }
}
