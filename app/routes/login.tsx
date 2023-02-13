import type { ActionFunction, LinksFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, useTransition, useActionData, Link } from "@remix-run/react"
import { login, createUserSession } from "~/utils/session.server"
import stylesUrl from "../styles/login.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get("username") as string
  const password = form.get("password") as string
  // let logged_user = await login({ username, password })
  if (username === "admin" && password === "panchitaloca") {
    return createUserSession("uid_123456789", "/admin/all-stores")
  }
  return json("⛔ Authentication Failed ⛔ ", {
    status: 401,
  })
}

export default function Login() {
  let loginResult = useActionData()
  console.log(loginResult)
  const transition = useTransition()
  return (
    <div className='container'>
      <div style={{ marginTop: "30%" }} className='content' data-light=''>
        <h1>H4</h1>
        <Form id='login' method='post'>
          <div>
            <label htmlFor='username-input'>Username</label>
            <input type='text' id='username-input' name='username' />
          </div>
          <div>
            <label htmlFor='password-input'>Password</label>
            <input id='password-input' name='password' type='password' />
          </div>
          {loginResult ? (
            <Link to='/login'>
              <span style={{ color: "red" }}>{loginResult}</span> -{" "}
              <b>Try Again</b>
            </Link>
          ) : (
            <button
              disabled={transition.state !== "idle"}
              type='submit'
              className='button'
            >
              {transition.state !== "idle" ? "Loading All Stores..." : "Submit"}
            </button>
          )}
        </Form>
      </div>
    </div>
  )
}
