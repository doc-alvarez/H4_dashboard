import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function IndexRoute() {
  return (
    <div className='container'>
      <div className='content'>
        <h1>
          <Link to='/login'>
            <span>H4</span>
          </Link>
        </h1>
        <nav></nav>
      </div>
    </div>
  );
}
