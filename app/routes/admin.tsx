import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";
import { requireUserId, getAPIData } from "~/utils/session.server";
//Types
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import SalesPlace from "~/components/SalesPlace";
//Links
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

//Backend
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  let email = process.env.SIRIA_EMAIL as string;
  let password = process.env.SIRIA_PASS as string;
  let orders = await getAPIData({
    email,
    password,
  });
  console.log(orders);
  return json(400);
};

export default function JokesRoute() {
  const data = useLoaderData();
  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>🤪</span>
              <span className='logo-medium'>🤪 H4 Dashboard</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <SalesPlace name='Siria' data={{}} />
          <SalesPlace name='Lacroze' data={{}} />
          <div className='jokes-outlet'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
