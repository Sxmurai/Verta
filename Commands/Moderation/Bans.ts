import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class BansCommand extends Command {
  public constructor() {
    super("bans", {
      aliases: ["bans", "banlist"],
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      description: {
        content: "Views all of the guilds bans",
        usage: "bans <page>",
        examples: ["bans 2", "bans"]
      },
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"]
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const bans = await message.guild.fetchBans();

    if (!bans.size)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(`There are no bans in the guild.`)
      );

    const itemsPerPage = 10;
    const maxPages = Math.ceil(bans.size / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = bans.map((ban: any) => {
      return {
        user: ban.user,
        reason: ban.reason
      };
    });

    const toDisplay =
      items.length > itemsPerPage
        ? items.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
          )
        : items;

    const embed = new VertaEmbed(message)
      .setColor("#3291a8")
      .setAuthor(
        `Bans | ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      );

    if (maxPages > 1) embed.setFooter(`Page: ${page}/${maxPages}`);

    let index = (page - 1) * itemsPerPage + 1;

    for (const { user, reason } of toDisplay) {
      embed.addField(
        `#${Number(index++)
          .toString()
          .padStart(2, "0")} ${(await this.client.users.fetch(user.id)).tag ||
          "Unknown"}`,
        reason.length > 1024 ? `${reason.substr(0, 1024)}...` : reason
      );
    }

    return message.util?.send({ embed });
  }
}
