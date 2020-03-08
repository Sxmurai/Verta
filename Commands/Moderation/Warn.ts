import { Command } from "discord-akairo";
import { Message, GuildMember } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

import { Repository, In } from "typeorm";
import { Infractions } from "../../Client/Models/Infractions";

export default class WarnCommand extends Command {
  public constructor() {
    super("warn", {
      aliases: ["warn", "warnum", "w"],
      args: [
        {
          id: "member",
          type: "member",
          prompt: {
            start: "Please provide a member to warn",
            retry: "I need a valid member to warn"
          }
        },

        {
          id: "reason",
          type: "string",
          match: "rest",
          default: "No reason provided"
        }
      ],
      description: {
        content: "Warns a member in the guild",
        usage: "warn [member] <reason>",
        examples: [
          "warn @Samurai reeeeeeee",
          "warn Film making a shit FilmXL bot",
          "warn 123456789012345678"
        ]
      },
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild"
    });
  }

  public exec(
    message: Message,
    { member, reason }: { member: GuildMember; reason: string }
  ) {
    const repo: Repository<Infractions> = this.client.db.getRepository(
      Infractions
    );

    let caseID = this.client.settings.get(message.guild.id, "caseID", 0);

    this.client.settings.set(message.guild.id, "caseID", caseID + 1);

    repo.insert({
      rowid: null,
      caseID: caseID,
      guild: message.guild.id,
      target: member.id,
      moderator: message.author.id,
      warnedAt: Date.now(),
      reason: reason,
      type: "Warn"
    });

    return message.util?.send(
      new VertaEmbed(message)
        .setColor("#3291a8")
        .setDescription(`Warned: \`${member.user.tag}\` successfully.`)
    );
  }
}
