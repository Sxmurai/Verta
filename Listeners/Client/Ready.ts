import { Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class ReadyListener extends Listener {
  public constructor() {
    super("listeners-ready", {
      emitter: "client",
      event: "ready"
    });
  }

  public exec(message: Message) {
    let statuses: string | string[] = [
        `??help`,
        `??help | ${this.client.guilds.cache.size} guilds`,
        `??help | ${this.client.users.cache.size} users`
      ],
      i = 0;

    this.client.user.setStatus("dnd");

    this.client.logger.info(`Started!`);

    setTimeout(() => {
      this.client.user.setActivity(statuses[i++ % statuses.length], {
        type: "WATCHING"
      });
    }, 2e5);
  }
}
