import "@fontsource-variable/outfit";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import NotFound from "./NotFound.vue";
import "./lime.css";

export default {
  extends: DefaultTheme,
  // A confused buff instead of the default 404.
  Layout: () => h(DefaultTheme.Layout, null, { "not-found": () => h(NotFound) }),
};
