import { Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class TokenCommand extends Command {
  public constructor() {
    super("token", {
      aliases: ["token", "checktoken"],
      args: [
        {
          id: "token",
          type: "string",
          prompt: {
            start: "Please provide a token"
          }
        }
      ],
      description: {
        content: "Looks at a token and matches it to possible owners",
        usage: "token [token]",
        examples: ["token Ni..asdg..gasfd.gd.gdNot...agsd..dgf.asgd.g."]
      },
      ownerOnly: true
    });
  }

  public async exec(message: Message, { token }: { token: string }) {
    const TOKEN_REGEX = /([\w-]+={0,2})\.([\w-]+={0,2})\.([\w-]+={0,2})/g;
    const matches = TOKEN_REGEX.exec(token);

    if (!matches)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          `That token didn't match up to anything`
        )
      );

    const [, botID] = matches;

    const msg = await message.util?.send(
      `Searching long and wide for a result...`,
      { code: true }
    );

    let resolved = BigInt(Buffer.from(botID, "base64").toString());

    return msg.edit(
      `TOKEN: ${token}\n\nPossible Match: ${
        (await this.client.users.fetch(resolved.toString())).tag
      } (${resolved})\n\nHowever, I cannot login to the bot using the token as thats against the ToS`,
      { code: true }
    );
  }
}
