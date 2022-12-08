import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { useSearchParams, Form, useTransition } from "@remix-run/react";
import { login, createUserSession } from "~/utils/session.server";
import stylesUrl from "../styles/login.css";
import { redirect } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username") as string;
  const password = form.get("password") as string;
  let logged_user = await login({ username, password });
  if (logged_user) return createUserSession(logged_user, "/admin/all");
  return redirect("/login");
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  return (
    <div className='container'>
      <div style={{ marginTop: "30%" }} className='content' data-light=''>
        <h1>H4</h1>
        <Form id='login' method='post'>
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
          <button
            disabled={transition.state !== "idle"}
            type='submit'
            className='button'
          >
            {transition.state !== "idle" ? "Loading All Stores..." : "Submit"}
          </button>
        </Form>
      </div>
    </div>
  );
}
