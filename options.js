async function getConfig() {
  try {
    const result = await browser.storage.local.get("config");
    return result.config;
  } catch (error) {
    console.error("Error retrieving config:", error);
  }
}

(async () => {
  const config = await getConfig();
  document.getElementById("username").value = config.username || "";
  document.getElementById("ghToken").value = config.ghToken || "";
  document.getElementById("badge").checked = config.badge || false;
  document.getElementById("badgeColor").value = config.badgeColor || "";
})();

document
  .getElementById("settingsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const ghToken = document.getElementById("ghToken").value;
    const badge = document.getElementById("badge").checked;
    const badgeColor = document.getElementById("badgeColor").value;

    const config = {
      username,
      ghToken,
      badge,
      badgeColor,
    };

    console.debug("Saved Settings", config);
    browser.storage.local.set({ config });
    browser.browserAction.setBadgeBackgroundColor({
      color: config.badgeColor || "#000",
    });
    if (config.badge) {
      browser.browserAction.setBadgeText({ text: "..." });
    } else {
      browser.browserAction.setBadgeText({ text: "" });
    }
  });
