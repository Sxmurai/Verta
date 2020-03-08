import { Command } from "discord-akairo";
import { Message } from "discord.js";

import fetch from "node-fetch";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

export default class LyricsCommand extends Command {
  public constructor() {
    super("lyrics", {
      aliases: ["lyrics", "lyricsearch"],
      args: [
        {
          id: "title",
          type: "string",
          match: "rest",
          prompt: {
            start: "Please provide a search query."
          }
        },

        {
          id: "censored",
          match: "flag",
          flag: ["--censored"]
        }
      ],
      description: {
        content: "Displays lyrics for a song.",
        usage: "lyrics [song] <--censored>",
        examples: ["lyrics Valentino", "lyrics iunno --censored"]
      }
    });
  }

  public async exec(
    message: Message,
    { title, censored }: { title: string; censored: boolean }
  ) {
    const res = await fetch(
      `https://some-random-api.ml/lyrics?title=${encodeURIComponent(title)}`
    );
    const json = await res.json();

    if (!json || json.error)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          `The query: \`${title}\` was not found.`
        )
      );

    let swearRegex = /fuck|bitch|nigga|nigger|asshole|ass|dick|pussy|cock|cunt|twat|wank|wanker|niggas|niggers|fucker|fuckface|shit|damn|goddamn|jesus.christ|christ|jesus|piss|pissed|whore|hoe|shat|shite|porn|tits|xvideos|pornhub|xxxvideos|hentai|booty|thong|erection|/gi;

    let lyrics = json.lyrics;

    if (censored)
      lyrics = json.lyrics.replace(swearRegex, char => "#".repeat(char.length));

    const embed = new VertaEmbed(message)
      .setAuthor(
        `Author: ${json.author}`,
        message.author.displayAvatarURL({ dynamic: true }),
        json.links.genius
      )
      .setThumbnail(json.thumbnail.genius)
      .setColor("#3291a8")
      .setTitle(`${json.title} ${censored ? "(CENSORED)" : ""}`)
      .setDescription(
        lyrics.length > 2000 ? `${lyrics.substr(0, 2000)}...` : lyrics
      )
      .setFooter(
        lyrics.length > 2000 ? "Click the song author for the full lyrics." : ""
      );

    return message.util?.send({ embed });
  }
}
