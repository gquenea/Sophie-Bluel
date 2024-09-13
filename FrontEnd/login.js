const loginForm = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
let token = "";

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  if (response.status === 200) {
    const setToken = await response.json();
    if (typeof token === "string" && localStorage.getItem("token") === null) {
      localStorage.setItem("token", setToken.token);
      window.location.href = "./index.html";
    }
  } else {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = `Les identifiants que vous avez saisi sont incorrects`;
  }
});
