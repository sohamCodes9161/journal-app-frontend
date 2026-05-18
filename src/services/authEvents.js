let logoutHandler = null;

export function registerLogoutHandler(handler) {
  logoutHandler = handler;
}

export function triggerLogoutEvent() {
  if (logoutHandler) {
    logoutHandler();
  }
}
