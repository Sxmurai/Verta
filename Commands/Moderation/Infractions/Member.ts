import { Command } from "discord-akairo";
import { Message, User } from "discord.js";

import VertaEmbed from "../../../Client/Utils/VertaEmbed";

import { Repository } from "typeorm";
import { Infractions } from "../../../Client/Models/Infractions";

export default class InfractionsCommand extends Command {
  public constructor() {
    super("infractions-member", {
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild",
      args: [
        {
          id: "user",
          type: "user",
          prompt: {
            start: "Please provide a user to view the infractions on",
            retry: "I need a valid user"
          }
        },

        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      category: "Moderation"
    });
  }

  public async exec(
    message: Message,
    { user, page }: { user: User; page: number }
  ) {
    const repo: Repository<Infractions> = this.client.db.getRepository(
      Infractions
    );
    const data = await repo.find({ guild: message.guild.id, target: user.id });

    if (!data.length)
      return message.util?.send(
        new VertaEmbed(message)
          .setColor("#f22929")
          .setDescription(`There are no infractions for: \`${user.username}\``)
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
        `Infractions | ${user.username} (${user.id})`,
        user.displayAvatarURL()
      );

    if (maxPages > 1) embed.setFooter(`Page: ${page}/${maxPages}`);

    toDisplay.forEach(infraction => {
      embed.addField(
        `#${infraction.caseid} [${infraction.type}] - ${new Date(
          infraction.warnedAt
        ).toLocaleString()} | ${this.client.users.cache.get(
          infraction.moderator
        ).username || "unknown"}`,
        infraction.reason
      );
    });

    return message.util?.send({ embed });
  }
}
