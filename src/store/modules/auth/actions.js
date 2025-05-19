let timer;
export default {
  async login(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "login",
    });
  },
  async signup(context, payload) {
    return context.dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD0qSBSHj5OKrnXr31aSdbTnZebPxU1pjk";

    if (mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD0qSBSHj5OKrnXr31aSdbTnZebPxU1pjk";
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      let errorMessage = "Failed to authenticate. Check your login data.";
      if (responseData.error && responseData.error.message) {
        // Handle Firebase specific error messages
        switch (responseData.error.message) {
          case "EMAIL_EXISTS":
            errorMessage = "This email is already registered.";
            break;
          case "OPERATION_NOT_ALLOWED":
            errorMessage = "Password sign-in is disabled for this project.";
            break;
          case "TOO_MANY_ATTEMPTS_TRY_LATER":
            errorMessage = "Too many attempts. Try again later.";
            break;
          case "EMAIL_NOT_FOUND":
            errorMessage = "Email not found. Please check your email.";
            break;
          case "INVALID_PASSWORD":
            errorMessage = "Invalid password. Please check your password.";
            break;
          case "USER_DISABLED":
            errorMessage = "This user account has been disabled.";
            break;
          default:
            errorMessage = responseData.error.message;
        }
      }
      const error = new Error(errorMessage);
      throw error;
    }

    const expiresIn = +responseData.expiresIn * 1000;
    const experationDate = new Date().getTime() + expiresIn;

    localStorage.setItem("token", responseData.idToken);
    localStorage.setItem("userId", responseData.localId);
    localStorage.setItem("tokenExpiration", experationDate);

    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer = setTimeout(function () {
      context.dispatch("autoLogout");
    }, expiresIn);

    if (token && userId) {
      context.commit("setUser", {
        token: token,
        userId: userId,
      });
    }
  },
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(timer);

    context.commit("setUser", {
      token: null,
      userId: null,
    });
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};
