import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { Link, useSearchParams, useActionData } from "@remix-run/react";
import { login } from "~/utils/session.server";
import stylesUrl from "../styles/login.css";
import { json, redirect } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;
  let logged_user = await login({ username, password });
  if (logged_user) return redirect("/admin");

  return redirect("/");
};

export default function Login() {
  const logged_user = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <div className='container'>
      <div className='content' data-light=''>
        <h1>Login</h1>
        <form method='post'>
          <input
            type='hidden'
            name='redirectTo'
            value={searchParams.get("redirectTo") ?? undefined}
          />

          <div>
            <label htmlFor='username-input'>Username</label>
            <input type='text' id='username-input' name='username' />
          </div>
          <div>
            <label htmlFor='password-input'>Password</label>
            <input id='password-input' name='password' type='password' />
          </div>
          <button type='submit' className='button'>
            Submit
          </button>
        </form>
        <div>
          {logged_user?.username ? <div>{logged_user.username}</div> : null}
        </div>
      </div>
      <div className='links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
