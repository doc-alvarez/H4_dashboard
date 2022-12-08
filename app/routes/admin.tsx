import { Link, NavLink, Outlet, useTransition } from "@remix-run/react";
import { json } from "@remix-run/node";
import stylesUrl from "~/styles/jokes.css";
import { requireUserId } from "~/utils/session.server";
import logo from "../../app/sand.jpg";
//Types
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
//Links
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
//Backend
export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return json("");
};

export default function AdminRoute() {
  const transition = useTransition();
  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>H4</span>
            </Link>
          </h1>
          <div>
            <img
              style={{ width: "90px" }}
              src='http://www.i2symbol.com/pictures/emojis/f/d/1/1/fd115eea14595f2ddc105dd7e2e56970.png'
              alt=''
            />
          </div>
          <div>
            <h3>Welcome Admin</h3>
            <Link to='/logout'>
              <h3>Logout</h3>
            </Link>
          </div>
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='siria'
              >
                Subway Siria
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='botanico'
              >
                Daniel Botanico
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='lacroze'
              >
                Subway Lacroze
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='mireya'
              >
                Daniel Mireya
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='all'
              >
                All
              </NavLink>
            </h3>
          </div>
          <div className='jokes-outlet'>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
