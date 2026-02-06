export function getSession() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  return loggedUser;
}

export function checkSession(loggedUser) {
  if (!loggedUser) {
    window.location.href = "./../index.html";
  }
}