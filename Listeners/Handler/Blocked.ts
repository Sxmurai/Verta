import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class BlockedListener extends Listener {
  public constructor() {
    super("listener-blocked", {
      emitter: "commandHandler",
      event: "commandBlocked"
    });
  }

  public exec(message: Message, cmd: Command, reason: string) {
    switch (reason) {
      case "owner":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You must be a bot owner for this command.`
          )
        );
        break;

      case "guild":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You must be in a guild for this command.`
          )
        );
        break;

      case "dm":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You must be in a DM for this command.`
          )
        );
        break;

      case "blacklist":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You have been blacklisted. Think this is a mistake? Contact: <@535585397435006987>`
          )
        );
        break;
    }
  }
}
