import { Listener } from "discord-akairo";

export default class UnhandledRejectionListener extends Listener {
  public constructor() {
    super("process-warning", {
      emitter: "process",
      event: "warning"
    });
  }

  public exec(warning: Error) {
    this.client.logger.error(
      `Process Warning: ${warning.message} at ${warning.stack}`
    );
  }
}
