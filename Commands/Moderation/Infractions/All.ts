import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../../Client/Utils/VertaEmbed";

import { Repository } from "typeorm";
import { Infractions } from "../../../Client/Models/Infractions";

export default class InfractionsCommand extends Command {
  public constructor() {
    super("infractions-all", {
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      category: "Moderation",
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild"
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const repo: Repository<Infractions> = this.client.db.getRepository(
      Infractions
    );
    const data = await repo.find({ guild: message.guild.id });

    if (!data.length)
      return message.util?.send(
        new VertaEmbed(message)
          .setColor("#f22929")
          .setDescription(`There are no infractions for this guild.`)
      );

    const itemsPerPage = 5;
    const maxPages = Math.ceil(data.length / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = data.map(infraction => {
      return {
        user: infraction.target,
        moderator: infraction.moderator,
        type: infraction.type,
        reason: infraction.reason,
        warnedAt: infraction.warnedAt,
        caseid: infraction.caseID
      };
    });

    const toDisplay = items.slice((page - 1) * itemsPerPage, itemsPerPage);

    const embed = new VertaEmbed(message)
      .setColor("#3291a8")
      .setAuthor(
        `Infractions | ${message.guild.name}`,
        message.guild.iconURL()
      );

    if (maxPages > 1) embed.setFooter(`Page: ${page}/${maxPages}`);

    toDisplay.forEach(infraction => {
      embed.addField(
        `#${infraction.caseid} [${infraction.type}] - ${new Date(
          infraction.warnedAt
        ).toLocaleString()} | Mod: ${this.client.users.cache.get(
          infraction.moderator
        ).username || "unknown"}, Warnee: ${this.client.users.cache.get(
          infraction.user
        ).tag || "Unknown"}`,
        infraction.reason
      );
    });

    return message.util?.send({ embed });
  }
}
