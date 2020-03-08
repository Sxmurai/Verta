import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "latency"],
      description: {
        content: "Pong! Displays the bots latency",
        usage: "ping",
        examples: ["ping"]
      },
      typing: false
    });
  }

  public async exec(message: Message) {
    const start = Date.now();

    const msg = await message.util.send("Pinging..");

    return new Promise(resolve => {
      (<any>this.client["api"]).channels[message.channel.id].typing
        .post()
        .then(() => {
          return resolve(
            message.util?.send(
              new VertaEmbed(message).setColor("#3291a8").setTitle(`🏓 - Pong!`)
                .setDescription(`
                    **Bot**: \`${this.client.ws.ping}MS\`
                    **Response**: \`${msg.createdTimestamp -
                      message.createdTimestamp}MS\`
                    **API**: \`${Date.now() - start}MS\``)
            )
          );
        });
    });
  }
}
