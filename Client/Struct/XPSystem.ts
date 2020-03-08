import { AkairoClient } from "discord-akairo";
import { Message, Guild, GuildMember } from "discord.js";

import { Repository } from "typeorm";
import { Level } from "../../Client/Models/Level";

export default class VertaXPSystem {
  private client: AkairoClient;
  private recentlyTalked = new Set();
  private generatedXP: number = Math.floor(Math.random() * 50);

  public constructor(client: AkairoClient) {
    this.client = client;
  }

  public async generateXP(message) {
    if (
      !message.guild ||
      message.author.bot ||
      message.content.startsWith(
        this.client.settings.get(message.guild.id, "config.prefix", "??")
      ) ||
      this.client.settings
        .get("global", "all.blacklist", [])
        .includes(message.author.id) ||
      message.channel.type == "dm"
    )
      return;

    const repo: Repository<Level> = this.client.db.getRepository(Level);

    const data: Level = await repo.findOne({
      guild: message.guild.id,
      user: message.author.id
    });

    if (!data)
      return repo.insert({
        guild: message.guild.id,
        user: message.author.id,
        xp: this.generatedXP,
        level: 0
      });

    data.xp = data.xp + this.generatedXP;

    if (data.xp >= data.level * 50) {
      data.level++;

      this.client.logger.debug(
        `${message.author.tag} (${message.author.id}) Leveled to: ${data.level} in guild: ${message.guild.name} (${message.guild.id})`
      );

      data.xp = 0;
    }

    this.recentlyTalked.add(message.author.id);
    setTimeout(() => this.recentlyTalked.delete(message.author.id), 60000);

    return await repo.save(data);
  }
}
