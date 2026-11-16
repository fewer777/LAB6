const result = document.querySelector("#result");
document.querySelector("#login").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(form))) });
  form.elements.password.value = "";
  result.textContent = `Login: ${response.status}`;
});
document.querySelector("#me").addEventListener("click", async () => {
  const response = await fetch("/api/me");
  result.textContent = `${response.status}: ${await response.text()}`;
});
document.querySelector("#logout").addEventListener("click", async () =>
{
    const tokenResponse = await fetch("/api/antiforgery/token", {
        credentials: "same-origin"
    });
    if (!tokenResponse.ok)
    {
        result.textContent = `CSRF token: ${tokenResponse.status}`;
        return;
    }
    const { requestToken } = await tokenResponse.json();
    const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", headers: { "X-CSRF-TOKEN": requestToken}
    });
    result.textContent = `Logout: ${response.status}`;
});