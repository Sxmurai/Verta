import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../../Client/Utils/VertaEmbed";

export default class Base64Command extends Command {
  public constructor() {
    super("encode", {
      args: [
        {
          id: "string",
          type: "string",
          match: "content",
          prompt: {
            start: "Please provide a string"
          }
        }
      ],
      category: "Utils"
    });
  }

  public exec(message: Message, { string }: { string: string }) {
    return message.util?.send(
      new VertaEmbed(message)
        .setColor("#3291a8")
        .setDescription(Buffer.from(string).toString("base64"))
    );
  }
}
