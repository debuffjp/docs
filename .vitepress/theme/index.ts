import "@fontsource-variable/outfit";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import BlogIndex from "./BlogIndex.vue";
import BlogPostMeta from "./BlogPostMeta.vue";
import CopyCommand from "./CopyCommand.vue";
import HeroInfo from "./HeroInfo.vue";
import NotFound from "./NotFound.vue";
import PlayEmbed from "./PlayEmbed.vue";
import PlinkoHero from "./PlinkoHero.vue";
import SizeChart from "./SizeChart.vue";
import Timeline from "./Timeline.vue";
import "./lime.css";

export default {
  extends: DefaultTheme,
  // Usable in any page: <PlinkoHero /> and <PlayEmbed src="/play/…/" title="…" />.
  enhanceApp({ app }: { app: import("vue").App }) {
    app.component("PlinkoHero", PlinkoHero);
    app.component("PlayEmbed", PlayEmbed);
    app.component("CopyCommand", CopyCommand);
    app.component("BlogIndex", BlogIndex);
    app.component("SizeChart", SizeChart);
    app.component("Timeline", Timeline);
  },
  // A confused buff instead of the default 404; a playable debuff demo instead of a hero image.
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "not-found": () => h(NotFound),
      "home-hero-image": () => h(PlinkoHero),
      "home-hero-info": () => h(HeroInfo),
      "doc-before": () => h(BlogPostMeta),
    }),
};
