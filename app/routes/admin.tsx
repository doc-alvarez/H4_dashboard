import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import stylesUrl from "~/styles/jokes.css";
import { db } from "~/utils/db.server";

//Types
import type { LinksFunction, LoaderFunction } from "@remix-run/node";

//Links
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

//Backend
export const loader: LoaderFunction = async ({ request }) => {
  const EMAIL = "63953@linisco.com.ar";
  const user = await db.users.findUnique({ where: { username: "tincho" } });
  const orders = await fetch("https://pos.linisco.com.ar/sale_orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-User-Email": EMAIL,
      "X-User-Token": user!.token!,
    },
  });
  const _orders = await orders.json();
  let data = {
    local: "Lacroze",
    len: _orders.length,
    salesTotal: _orders.reduce((acc, val) => acc + val.total, 0),
    cashTotal: _orders
      .map((order) => {
        if (order.paymentmethod === "cash") {
          return order.total;
        } else {
          return null;
        }
      })
      .reduce((acc, val) => (val ? acc + val : acc), 0),
  };

  return json(data, {
    headers: {
      "cache-control": "max-age=3600",
    },
  });
};

export default function JokesRoute() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div className='jokes-layout'>
      <header className='jokes-header'>
        <div className='container'>
          <h1 className='home-link'>
            <Link to='/' title='Remix Jokes' aria-label='Remix Jokes'>
              <span className='logo'>🤪</span>
              <span className='logo-medium'>🤪H4</span>
              <input type='date'></input>
            </Link>
          </h1>
        </div>
      </header>
      <main className='jokes-main'>
        <div className='container'>
          <div className='jokes-list'>
            <h3>Siria / Subway</h3>
            <hr></hr>
            <p>Total Orders: {data.len}</p>
            <p>Total Sales: $ {data.salesTotal}</p>
            <p>Total Cash $ {data.cashTotal}</p>
            <p>Total electronics: $ {data.salesTotal - data.cashTotal}</p>
          </div>

          <div className='jokes-outlet'>{/* <Outlet /> */}</div>
        </div>
      </main>
    </div>
  );
}
