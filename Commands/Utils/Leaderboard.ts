import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

import { Repository } from "typeorm";
import { Level } from "../../Client/Models/Level";

export default class LeaderboardCommand extends Command {
  public constructor() {
    super("leaderboard", {
      aliases: ["leaderboard", "lb"],
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      description: {
        content: "Displays the guilds leaderboard",
        usage: "leaderboard <page>",
        examples: ["leaderboard 2", "leaderboard"]
      },
      channel: "guild"
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const repo: Repository<Level> = this.client.db.getRepository(Level);
    const data = await repo.find({ guild: message.guild.id });

    if (!data.length)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          "Theres nothing on the guild's leaderboard!"
        )
      );

    const itemsPerPage = 10;
    const maxPages = Math.ceil(data.length / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = data
      .sort((a, b) => b.level - a.level)
      .map(user => {
        return {
          level: user.level,
          user: user.user
        };
      });

    const toDisplay = items.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

    const embed = new VertaEmbed(message)
      .setColor("#3291a8")
      .setAuthor(
        `Leaderboard | ${message.guild.name}`,
        message.guild.iconURL()
      );

    if (maxPages > 1) embed.setFooter(`Page: ${page}/${maxPages}`);

    let leaderboard = ``,
      levels = ``,
      i = (page - 1) * itemsPerPage;

    for (const { level, user } of toDisplay) {
      leaderboard += `\`#${Number(i++ + 1)
        .toString()
        .padStart(2, "0")}\` **${
        (await this.client.users.fetch(user)).tag
      }**\n`;
      levels += `Level: \`${level}\`\n`;
    }

    embed
      .addField("User", leaderboard || "Something went wrong", true)
      .addField("\u200b", levels || "Something went wrong", true);

    return message.util?.send({ embed });
  }
}
