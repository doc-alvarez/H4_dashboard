import { db } from "./db.server";

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
    const EMAIL = "63953@linisco.com.ar";
    const PASSWORD = "p4sstr63953";
    const data = await fetch("https://pos.linisco.com.ar/users/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: {
          email: EMAIL,
          password: PASSWORD,
        },
      }),
    });
    const { authentication_token } = await data.json();
    let _updatedUser = await db.users.update({
      where: {
        id: user_check.id,
      },
      data: {
        token: authentication_token,
      },
    });
    return _updatedUser;
  } else {
    console.log("login failed");
  }
}
