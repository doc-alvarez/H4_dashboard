import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loder: LoaderFunction = async () => {
  return redirect("/admin/all");
};
export default function IndexRoute() {
  return <div></div>;
}
