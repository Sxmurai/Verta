import { Command, Flag, PrefixSupplier } from "discord-akairo";
import { Message } from "discord.js";

export default class InfractionsCommand extends Command {
  public constructor() {
    super("infractions", {
      aliases: ["infractions"],
      description: {
        content: "Displays the infractions on a member",
        usage: "infractions [member|all|filter|edit|delete] <...arguments>",
        examples: [
          "infractions member @Username",
          "infractions all",
          "infractios filter ban",
          "infractions edit 2 wrong",
          "infractions delete 2"
        ]
      },
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild"
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["infractions-member", "member", "user"],
        ["infractions-all", "all", "everything"],
        ["infractions-filter", "filter", "find"],
        ["infractions-edit", "edit", "reason"],
        ["infractions-delete", "delete", "del"]
      ],

      otherwise: (_: Message) => {
        //@ts-ignore
        const prefix = (this.handler.prefix as PrefixSupplier)(_);

        return `Invalid usage. Use: \`${prefix}help infractions\` to see the correct usage.`;
      }
    };

    return Flag.continue(method);
  }
}
