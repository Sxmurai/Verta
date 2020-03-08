import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class TabooCommand extends Command {
  public constructor() {
    super("taboo", {
      aliases: ["taboo"],
      description: {
        content: "Plays a game of taboo. Guess the word!",
        usage: "taboo"
      },
      channel: "guild"
    });
  }

  public async exec(message: Message) {
    const tabooGame = this.client.settings.get(
      message.guild.id,
      "games.taboo",
      {}
    );
    if (tabooGame.host)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          `Theres already a game of taboo going on.`
        )
      );

    let wordArr: string[] = [
      "computer",
      "laptop",
      "internet",
      "discord",
      "food",
      "water",
      "cow",
      "cat",
      "dog",
      "sheep",
      "jester",
      "math",
      "global",
      "information",
      "game",
      "video",
      "example",
      "paper",
      "rock",
      "mutual",
      "risk",
      "joker",
      "Coco-Cola",
      "message",
      "email"
    ];

    const randomWord = wordArr[Math.floor(Math.random() * wordArr.length)];

    message.author
      .send(
        `The word is: \`${randomWord}\`. Give them hints.\n\nThey have **5** minutes to guess.`
      )
      .catch(() => message.util?.reply(`your DMS are closed.`));

    this.client.settings.set(message.guild.id, "games.taboo", {
      guild: message.guild.id,
      host: message.author.id,
      word: randomWord
    });

    await message.channel.send(
      `**${message.author.username}** was sent the word. Use the hints to guess the word! You have **5** minutes`
    );
    await (message.channel as TextChannel)
      .awaitMessages(
        (message: Message) =>
          message.content.toLowerCase() === randomWord.toLowerCase(),
        { errors: ["time"], time: 3e5, max: 1 }
      )
      .then(async all => {
        const first = all.first();
        if (first.author.id == message.author.id) {
          this.client.settings.delete(message.guild.id, "games.taboo");
          return message.util?.send(
            `Uh-oh, we have a cheater! The game has ended`
          );
        }

        message.util?.send(`**${first.author.username}** got the word right!`);

        this.client.settings.delete(message.guild.id, "games.taboo");
      })
      .catch(() => {
        message.util?.send(`Times up! The correct word was: \`${randomWord}\``);

        this.client.settings.delete(message.guild.id, "games.taboo");
      });
  }
}
