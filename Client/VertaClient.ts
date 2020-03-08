import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
  Flag
} from "discord-akairo";
import VertaEmbed from "./Utils/VertaEmbed";
import { Message, Util } from "discord.js";

import { Connection, Repository } from "typeorm";
import Database from "./Struct/Database";
import SettingsProvider from "./Struct/SettingsProvider";
import { Setting } from "./Models/Settings";
import { Tags } from "./Models/Tags";

import { owners, token } from "./Utils/Config";
import Logger from "@ayanaware/logger";

declare module "discord-akairo" {
  interface AkairoClient {
    inhibitorHandler: InhibitorHandler;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    config: Options;
    logger: Logger;
    settings: SettingsProvider;
    db: Connection;
  }
}

interface Options {
  owners?: string | string[];
  token?: string;
}

export default class VertaClient extends AkairoClient {
  public logger: Logger = Logger.get(VertaClient);
  public db!: Connection;
  public settings!: SettingsProvider;

  public constructor(config: Options) {
    super(
      {
        ownerID: owners
      },

      {
        disableMentions: true,
        disabledEvents: ["TYPING_START"]
      }
    );

    this.config = config;

    this.commandHandler.resolver.addType("tag", async (message, phrase) => {
      if (!phrase || !message.guild) return Flag.fail(phrase);
      if (phrase.match(`<@!?(\d{17,19})>`)) return Flag.fail(phrase);

      phrase = Util.cleanContent(phrase.toLowerCase(), message);

      let tag;

      try {
        const repo: Repository<Tags> = this.db.getRepository(Tags);
        const data = await repo.findOne({
          guild: message.guild.id,
          name: phrase
        });

        tag = data;
      } catch {}

      return tag || Flag.fail(phrase);
    });

    this.commandHandler.resolver.addType(
      "existingTag",
      async (message, phrase) => {
        if (!phrase || !message.guild) return Flag.fail(phrase);
        if (phrase.match(`<@!?(\d{17,19})>`)) return Flag.fail(phrase);

        phrase = Util.cleanContent(phrase.toLowerCase(), message);

        let tag;

        try {
          const repo: Repository<Tags> = this.db.getRepository(Tags);
          const data = await repo.findOne({
            guild: message.guild.id,
            name: phrase
          });

          tag = data;
        } catch {}

        return tag ? Flag.fail(phrase) : phrase;
      }
    );
  }

  public commandHandler: CommandHandler = new CommandHandler(this, {
    prefix: (msg: Message) =>
      msg.guild ? this.settings.get(msg.guild.id, "config.prefix", "??") : "??",
    allowMention: true,
    aliasReplacement: /-/g,
    commandUtil: true,
    handleEdits: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str?: string) => new VertaEmbed(_).errorEmbed(str),
        modifyRetry: (_, str?: string) => new VertaEmbed(_).errorEmbed(str),
        cancel: _ =>
          new VertaEmbed(_).errorEmbed(
            "Alright, I've cancelled the command for you."
          ),
        ended: _ =>
          new VertaEmbed(_).errorEmbed(
            "You took too many tries to respond correctly, so I've cancelled the command"
          ),
        timeout: _ =>
          new VertaEmbed(_).errorEmbed(
            "You took long to respond, so I've cancelled the command"
          ),
        retries: 3,
        time: 6e4
      },
      otherwise: ""
    },
    ignoreCooldown: this.ownerID,
    ignorePermissions: this.ownerID,
    commandUtilLifetime: 6e5,
    defaultCooldown: 15e3,
    directory: require("path").join(__dirname, "..", "Commands"),
    automateCategories: true
  });

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: require("path").join(__dirname, "..", "Listeners")
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: require("path").join(__dirname, "..", "Inhibitors")
  });

  private async init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process: process
    });

    this.db = Database.get("VertaDB");

    await this.db.connect();
    await this.db.synchronize();

    this.settings = new SettingsProvider(this.db.getRepository(Setting));

    this.settings.init();

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
    this.inhibitorHandler.loadAll();
  }

  public async start(): Promise<string> {
    await this.init();

    return this.login(this.config.token);
  }
}
