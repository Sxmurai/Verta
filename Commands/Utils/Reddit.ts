import { Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

import VertaEmbed from "../../Client/Utils/VertaEmbed";

import fetch from "node-fetch";

export default class RedditCommand extends Command {
  public constructor() {
    super("reddit", {
      aliases: ["reddit", "subreddit", "searchreddit"],
      args: [
        {
          id: "subreddit",
          type: "string",
          match: "content",
          prompt: {
            start: "Please provide a subreddit"
          }
        }
      ],
      description: {
        content: "Browses the selected subreddit and gets a random post.",
        usage: "reddit [subreddit]",
        examples: ["reddit memes"]
      },
      channel: "guild"
    });
  }

  public async exec(message: Message, { subreddit }: { subreddit: string }) {
    const res = await fetch(
      `https://www.reddit.com/r/${encodeURIComponent(
        subreddit
      )}.json?sort=top&t=week`
    );

    const json = await res.json();

    if (json.error === 404)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          `The query: \`${subreddit}\` was not found.`
        )
      );

    const safe = (message.channel as TextChannel).nsfw
      ? json.data.children
      : json.data.children.filter(post => !post.data.over_18);
    if (!safe.length)
      return message.util?.send(
        new VertaEmbed(message).errorEmbed(
          `That post was NSFW, but you are in a SFW channel. I cannot allow you to see that content.`
        )
      );

    const random = Math.floor(Math.random() * safe.length);

    const embed = new VertaEmbed(message)
      .setColor("#3291a8")
      .setAuthor(
        `${safe[random].data.author}`,
        message.author.displayAvatarURL({ dynamic: true }),
        `https://reddit.com${safe[random].data.permalink}`
      )
      .setTitle(`**${safe[random].data.title || "Unknown Title"}**`)
      .setFooter(
        `👍 - ${safe[random].data.ups} | 💬 - ${safe[random].data.num_comments}`
      );

    if (safe[random].data.selftext)
      embed.setDescription(
        safe[random].data.selftext.length > 2000
          ? `${safe[random].data.selftext.substr(0, 2000)}...`
          : safe[random].data.selftext
      );
    if (safe[random].data.url) embed.setImage(safe[random].data.url);

    return message.util?.send({ embed });
  }
}
