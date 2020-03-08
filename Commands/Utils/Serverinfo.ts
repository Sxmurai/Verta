import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class ServerinfoCommand extends Command {
  public constructor() {
    super("serverinfo", {
      aliases: ["serverinfo", "guildinfo", "guild", "server"],
      description: {
        content: "Displays the guilds server information",
        usage: "serverinfo",
        examples: ["serverinfo"]
      },
      channel: "guild"
    });
  }

  public exec(message: Message) {
    const embed = new MessageEmbed()
      .setColor("#3291a8")
      .setAuthor(`${message.guild.name} Information`, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .addField("ID", `\`${message.guild.id}\``, true)
      .addField(
        "Owner",
        `${message.guild.owner}\n\`${message.guild.ownerID}\``,
        true
      )
      .addField(
        "Partnered",
        `${message.guild.partnered ? "`Yes`" : "`No`"}`,
        true
      )
      .addField(
        "Created At",
        `\`${new Date(message.guild.createdAt).toLocaleString()}\``,
        true
      )
      .addField(
        "Members | Bots | Total",
        `\`${message.guild.members.cache.filter(m => !m.user.bot).size} | ${
          message.guild.members.cache.filter(m => m.user.bot).size
        } | ${message.guild.memberCount}\``,
        true
      )
      .addField(
        "Text | Voice | Totoal",
        `\`${
          message.guild.channels.cache.filter(c => c.type == "text").size
        } | ${
          message.guild.channels.cache.filter(c => c.type == "voice").size
        } | ${message.guild.channels.cache.size}\``,
        true
      )
      .addField(
        "Roles",
        message.guild.roles.cache.size > 15
          ? `${message.guild.roles.cache
              .first(15)
              .slice(0, -1)
              .sort((a, b) => b.position - a.position)
              .map(role => role)
              .join(", ")}...`
          : message.guild.roles.cache
              .first(15)
              .slice(0, -1)
              .sort((a, b) => b.position - a.position)
              .map(role => role)
              .join(", ") || "None"
      );

    return message.util.send({ embed });
  }
}
