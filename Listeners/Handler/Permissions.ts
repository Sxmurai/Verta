import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class PermissionListener extends Listener {
  public constructor() {
    super("listener-permission", {
      emitter: "commandHandler",
      event: "missingPermissions"
    });
  }

  public exec(message: Message, cmd: Command, type: string, permissions: any) {
    switch (permissions) {
      case "nsfw":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You need to be in a NSFW channel.`
          )
        );
        break;

      case "guildOwner":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(`You need to be a guild owner.`)
        );
        break;
    }

    switch (type) {
      case "client":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `I need the: ${this.missingPermissions(
              message.guild.me,
              permissions
            )} permission${
              permissions.length > 1 ? "s" : ""
            } for me to execute this command.`
          )
        );
        break;

      case "user":
        return message.util?.send(
          new VertaEmbed(message).errorEmbed(
            `You need the: ${this.missingPermissions(
              message.guild.me,
              permissions
            )} permission${
              permissions.length > 1 ? "s" : ""
            } for you to be able to execute this command.`
          )
        );
        break;
    }
  }

  missingPermissions(user: any, permissions: string[]) {
    const result = user.permissions.missing(permissions).map(
      str =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, char => char.toUpperCase())}\``
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
