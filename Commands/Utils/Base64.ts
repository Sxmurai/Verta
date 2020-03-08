import { Command, Flag, PrefixSupplier } from "discord-akairo";
import { Message } from "discord.js";

export default class Base64Command extends Command {
  public constructor() {
    super("base64", {
      aliases: ["base64", "b64"],
      description: {
        content: "Encodes or decodes strings with Base64",
        usage: "base64 [encode|decode] [string]",
        examples: [
          "base64 encode REEEEEEEEEEEEEEEEEEEE",
          "base64 decode dmFwZXI="
        ]
      }
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["encode", "e"],
        ["decode", "d"]
      ],

      otherwise: (_: Message) => {
        //@ts-ignore

        const prefix = (this.handler.prefix as PrefixSupplier)(_);

        return `Invalid usage. Use: \`${prefix}help base64\` for the proper usage`;
      }
    };

    return Flag.continue(method);
  }
}
