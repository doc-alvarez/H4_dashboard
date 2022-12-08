import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/admin/all-stores");
};

export default function IndexRoute() {
  return <div className='container'></div>;
}
