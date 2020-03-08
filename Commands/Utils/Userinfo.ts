import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember, User } from "discord.js";

export default class UserinfoCommand extends Command {
  public constructor() {
    super("userinfo", {
      aliases: ["userinfo", "whois", "info"],
      args: [
        {
          id: "member",
          type: "member",
          default: _ => _.member
        }
      ],
      description: {
        content:
          "Displays the user information on yourself, or a mentioned member",
        usage: "userinfo <member>",
        examples: [
          "userinfo Samurai",
          "userinfo 123456789012345678",
          "userinfo @Dyno",
          "userinfo"
        ]
      },
      channel: "guild"
    });
  }

  public exec(message: Message, { member }: { member: GuildMember }) {
    let object = {
      online: `\`Online\` ${this.client.emojis.cache.get(
        "660283475223379988"
      )}`,
      idle: `\`Idle\` ${this.client.emojis.cache.get("660283475034636288")}`,
      dnd: `\`Do Not Disturb\` ${this.client.emojis.cache.get(
        "660283474527387649"
      )}`,
      offline: `\`Offline\` ${this.client.emojis.cache.get(
        "660283474783109125"
      )}`
    };

    let object2 = {
      online: `${this.client.emojis.cache.get("660283475223379988")}`,
      idle: `${this.client.emojis.cache.get("660283475034636288")}`,
      dnd: `${this.client.emojis.cache.get("660283474527387649")}`,
      offline: `${this.client.emojis.cache.get("660283474783109125")}`
    };

    const embed = new MessageEmbed()
      .setColor(member.roles.highest.hexColor)
      .setTitle(`${object2[member.presence.status]} ${member.user.username}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(member)
      .addField("ID", `\`${member.id}\``, true)
      .addField("Nickname", `\`${member.nickname || "None set"}\``, true)
      .addField("Discriminator", `\`${member.user.discriminator}\``, true)
      .addField(
        "Created At",
        `\`${new Date(member.user.createdAt).toLocaleString("en-US")}\``,
        true
      )
      .addField(
        "Joined At",
        `\`${new Date(member.joinedAt).toLocaleString("en-US")}\``,
        true
      )
      .addField(
        "Boosting Since",
        `\`${
          member.premiumSince
            ? new Date(member.premiumSince).toLocaleString("en-US")
            : "Not boosting."
        }\``,
        true
      )
      .addField(
        "Devices",
        `${
          member.user.presence.status !== "offline"
            ? Object.keys(member.presence.clientStatus)
                .map(x => x.replace(/(\b\w)/gi, c => c.toUpperCase()))
                .join("\n")
            : "`None`"
        }`,
        true
      )
      .addField(
        "Game",
        `${
          member.presence.activities
            ? `${member.presence.activities
                .map(game => `\`${game}\``)
                .join("\n")}`
            : "`None`"
        }`,
        true
      )
      .addField("Status", `${object[member.presence.status]}`, true)
      .addField(
        "Permissions",
        `\`\`\`${member.permissions
          .toArray()
          .map(role => role.replace(/(\b\w)/gi, c => c.toUpperCase()))
          .join(", ") || "None"}\`\`\``
      )
      .addField(
        `Roles (${member.roles.cache.size - 1})`,
        member.roles.cache.size > 15
          ? `${member.roles.cache
              .first(15)
              .slice(0, -1)
              .sort((a, b) => b.position - a.position)
              .map(role => role)
              .join(", ")}...`
          : member.roles.cache
              .first(15)
              .slice(0, -1)
              .sort((a, b) => b.position - a.position)
              .map(role => role)
              .join(", ") || "None"
      );

    return message.util?.send({ embed });
  }
}
