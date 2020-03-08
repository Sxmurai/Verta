import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "commands"],
      args: [
        {
          id: "command",
          type: "commandAlias",
          default: null
        }
      ],
      description: {
        content: "Displays the commands for the bot",
        usage: "help <command name>",
        examples: ["help", "help ping"]
      }
    });
  }

  public exec(message: Message, { command }: { command: Command }) {
    if (!command) {
      const embed = new VertaEmbed(message)
        .setColor("#3291a8")
        .setAuthor(
          `Help Menu | ${
            message.guild ? message.guild.name : message.author.username
          }`,
          message.guild
            ? message.guild.iconURL()
            : message.author.displayAvatarURL()
        );

      for (const [name, category] of this.handler.categories.filter(
        c =>
          ![
            "flag",
            this.client.ownerID.includes(message.author.id) ? "" : "Owner",
            ...(message.member.hasPermission("MANAGE_MESSAGES", {
              checkAdmin: true,
              checkOwner: true
            }) || this.client.ownerID.includes(message.author.id)
              ? []
              : ["Moderation", "Configuration"])
          ].includes(c.id)
      )) {
        embed.addField(
          `• ${name} (${category.size})`,
          `${category
            .filter(cmd => cmd.aliases.length > 0)
            .map(cmd => `\`${cmd}\``)
            .join(" ") || "ripppp theres a problem"}`
        );
      }

      return message.util?.send({ embed });
    }

    const embed = new VertaEmbed(message)
      .setColor("#3291a8")
      .setAuthor(
        `Help: ${command} | ${
          message.guild ? message.guild.name : message.author.username
        }`,
        message.guild
          ? message.guild.iconURL()
          : message.author.displayAvatarURL()
      ).setDescription(`
        **Usage**: ??${command.description.usage}
        **Aliases**: ${
          command.aliases
            ? command.aliases.map(alias => `\`${alias}\``).join(" ")
            : "No aliases"
        }
        
        **Examples**:\n${
          command.description.examples
            ? command.description.examples.map(e => `\`${e}\``).join("\n")
            : command
        }`);

    return message.util?.send({ embed });
  }
}
