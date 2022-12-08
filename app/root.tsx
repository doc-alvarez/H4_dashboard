import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLocation,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";
import dark from "~/styles/dark.css";
import { ThemeProvider, useTheme } from "~/utils/theme-provider";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};
export function App() {
  let transition = useTransition();
  let [theme] = useTheme();
  console.log(theme);
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, minimum-scale=1' />
        <title>Dashboard</title>
        <Links />
      </head>
      <body
        id={theme === "dark" ? "darkMode" : "lightMode"}
        style={transition.state !== "idle" ? { cursor: "wait" } : {}}
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <p
          style={{
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "50px",
            paddingTop: "50px",
          }}
        >
          <a href='mailto:doctordalvarez@protonmail.com'>
            Developed by Catalyst ™️ 🚀 v0.1.0
          </a>
        </p>
      </body>
    </html>
  );
}
export default function AppProvider() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
