import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix", "setprefix"],
      args: [
        {
          id: "prefix",
          type: (_: Message, str: string) => {
            if (!str) return null;
            let currentPrefix = this.client.settings.get(
              _.guild.id,
              "config.prefix",
              "??"
            );

            if (currentPrefix === str) return null;

            return str;
          },
          prompt: {
            start: "Please provide a new prefix",
            retry: "Please provide a prefix that isn't the old prefix"
          },
          match: "content"
        }
      ],
      description: {
        content: "Sets the guilds prefix",
        usage: "prefix [new preifx]",
        examples: ["prefix !", "prefix ?"]
      },
      userPermissions: ["MANAGE_GUILD"]
    });
  }

  public exec(message: Message, { prefix }: { prefix: string }) {
    this.client.settings.set(message.guild.id, "config.prefix", prefix);

    return message.util?.send(
      new VertaEmbed(message)
        .setColor("#3291a8")
        .setDescription(`Changed the prefix to: \`${prefix}\``)
    );
  }
}
