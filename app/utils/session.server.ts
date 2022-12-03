import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

type LoginForm = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  const user_check = await db.users.findUnique({
    where: { username },
  });
  //   if (!user_check) return null;
  const pass_check = await db.users.findUnique({
    where: { password },
  });
  if (user_check && pass_check) {
    return user_check.id;
  } else {
    console.log("login failed");
  }
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "H4_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
export async function getAPIData({
  email,
  password,
  url = "",
}: {
  email: string;
  password: string;
  url?: string;
}) {
  const data = await fetch("https://pos.linisco.com.ar/users/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email,
        password: password,
      },
    }),
  });
  const { authentication_token } = await data.json();
  const orders = await fetch("https://pos.linisco.com.ar/sale_orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-User-Email": email,
      "X-User-Token": authentication_token,
    },
  });
  const _orders = await orders.json();
  return _orders;
}

// const user = await db.users.findUnique({ where: { username: "tincho" } });
// let data = {
//   local: "Lacroze",
//   len: _orders.length,
//   salesTotal: _orders.reduce((acc, val) => acc + val.total, 0),
//   cashTotal: _orders
//     .map((order) => {
//       if (order.paymentmethod === "cash") {
//         return order.total;
//       } else {
//         return null;
//       }
//     })
//     .reduce((acc, val) => (val ? acc + val : acc), 0),
// };
