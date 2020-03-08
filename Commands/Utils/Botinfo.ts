import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

import OSUtils, { NetStatMetrics } from "node-os-utils";
import fetch from "node-fetch";

export default class BotinfoCommand extends Command {
  public constructor() {
    super("botinformation", {
      aliases: ["botinfo", "botinformation"],
      args: [
        {
          id: "advanced",
          match: "flag",
          flag: ["--advanced", ":adv", "--adv", ":advanced"]
        }
      ],
      description: {
        content: "Displays the bots information",
        usage: "botinfo <--advanced>",
        examples: ["botinfo", "botinfo --advanced"]
      }
    });
  }

  public async exec(message: Message, { advanced }: { advanced: boolean }) {
    const embed = new VertaEmbed(message)
      .setAuthor(
        `Bot Information | ${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )
      .setColor("#3291a8")
      .addField(
        `Regular Information`,
        `**Guilds**: \`${this.client.guilds.cache.size}\`\n**Users**: \`${this.client.users.cache.size}\`\n**Emojis**: \`${this.client.emojis.cache.size}\`\n**Owner**: <@535585397435006987>`,
        true
      )
      .addField(
        `Process Information`,
        `**Node Version**: \`${
          process.version
        }\`\n**Langauge**: [\`Typescript\`](${"https://www.typescriptlang.org"})\n**Discord.js**: \`${
          require("discord.js").version
        }\`\n**Akairo**: \`${require("discord-akairo").version}\``,
        true
      );

    if (advanced) {
      const net = (await OSUtils.netstat.inOut()) as NetStatMetrics,
        cpu = await OSUtils.cpu.usage(),
        { heapUsed, heapTotal } = process.memoryUsage();

      embed.addField(
        `Advanced Information`,
        `**CPU Usage**: \`${Math.round(cpu)}%\`\n**Memory**: \`${Math.round(
          (heapUsed / 1024 / 1024) * 100
        ) / 100}MB / ${Math.round((heapTotal / 1024 / 1024) * 100) /
          100}MB\n\`**Operating System**: \`${
          process.platform
        }\`\n**Network**: \`${net.total.outputMb} ⬆️\` / \`${
          net.total.inputMb
        } ⬇️\``,
        true
      );
    }

    const commits = await this.getCommits();
    if (commits) embed.addField(`Github Commits`, commits);

    return message.util?.send({ embed });
  }

  private async getCommits() {
    const res = await fetch(
      "https://api.github.com/repos/Sxmurai/Verta/commits"
    );
    let str = "";
    const json = await res.json();

    for (const { sha, html_url, commit, author } of json.slice(0, 5)) {
      str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.substr(
        0,
        80
      )} - **[@${author.login.toLowerCase()}](${author.html_url})**\n`;
    }

    return str;
  }
}
