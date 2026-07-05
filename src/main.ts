import { mount } from "svelte";
import App from "./App.svelte";
import { applyTheme, getInitialTheme } from "./lib/theme";
import "./styles/tokens.css";
import "./styles/global.css";

applyTheme(getInitialTheme());

const target = document.getElementById("app");
if (!target) {
  throw new Error("Root element #app not found");
}

const app = mount(App, { target });

export default app;
