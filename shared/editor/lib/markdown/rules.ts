import markdownit, { PluginSimple } from "markdown-it";
import { matchPairs } from "./matchPairs";

export default function makeRules({
  rules = {},
  plugins = [],
}: {
  rules?: markdownit.Options;
  plugins?: PluginSimple[];
}) {
  const markdownIt = markdownit("default", {
    breaks: false,
    html: false,
    linkify: false,
    ...rules,
  });
  markdownIt.use(matchPairs);
  plugins.forEach((plugin) => markdownIt.use(plugin));
  return markdownIt;
}
