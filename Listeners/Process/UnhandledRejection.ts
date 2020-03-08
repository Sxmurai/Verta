import { Listener } from "discord-akairo";

export default class UnhandledRejectionListener extends Listener {
  public constructor() {
    super("process-unhandledRejection", {
      emitter: "process",
      event: "unhandledRejection"
    });
  }

  public exec(reason: string, promise: any) {
    this.client.logger.error(
      `UnhandledRejection: ${promise} for reason: ${reason} `
    );
  }
}
