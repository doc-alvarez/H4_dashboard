import { Link, NavLink, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
import stylesUrl from "~/styles/jokes.css";
import { requireUserId } from "~/utils/session.server";
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
                to='subway-siria'
              >
                Subway Siria
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='daniel-siria'
              >
                Daniel Siria
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='subway-lacroze'
              >
                Subway Lacroze
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='daniel-lacroze'
              >
                Daniel Lacroze
              </NavLink>
            </h3>
            <h3>
              <NavLink
                style={({ isActive }) => (isActive ? { color: "#959fbb" } : {})}
                to='all-stores'
              >
                All Stores
              </NavLink>
            </h3>
          </div>
          <div className='jokes-outlet'>
            <Outlet />
          </div>
        </div>
      </main>
      <p
        style={{
          fontSize: "20px",
          fontWeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "50px",
          paddingTop: "50px",
        }}
      >
        <a href='mailto:doctordalvarez@protonmail.com'>
          Developed by <strong>Catalyst ™️</strong> 🚀 v0.1.0
        </a>
      </p>
    </div>
  );
}
