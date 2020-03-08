import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class ErrorListener extends Listener {
  public constructor() {
    super("listeners-error-handler", {
      emitter: "commandHandler",
      event: "error"
    });
  }

  public async exec(error: Error, message: Message, cmd: Command) {
    this.client.logger.error(
      `Error on command: ${cmd}. Error: ${error.message}`
    );

    return message.util?.send(
      new VertaEmbed(message).errorEmbed(
        `There was an error while trying to execute the command: \`${cmd}\`. Please report this to the developer. <@535585397435006987>\n\n\`${error.message}\``
      )
    );
  }
}
