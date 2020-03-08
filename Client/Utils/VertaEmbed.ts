import { Message, MessageEmbed } from "discord.js";

export default class VertaEmbed extends MessageEmbed {
  public msg: Message;

  public constructor(msg: Message) {
    super();

    this.msg = msg;
  }

  public errorEmbed(error?: string): this {
    return this.setAuthor(
      `Oops, ${this.msg.author.tag}`,
      this.msg.author.displayAvatarURL()
    )
      .setColor("#e32929")
      .setDescription(error || "Unknown Error")
      .setFooter(
        `${this.msg.client.user.username} • ${new Date(
          Date.now()
        ).toLocaleTimeString()}`
      );
  }

  public addBlankField(): this {
    return this.addFields({
      name: "\u200B",
      value: "\u200B"
    });
  }
}
