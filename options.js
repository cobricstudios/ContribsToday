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
  document.getElementById("badge").value = config.badge || false;
})();

document
  .getElementById("settingsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const ghToken = document.getElementById("ghToken").value;
    const badge = document.getElementById("badge").value;

    const config = {
      username,
      ghToken,
      badge,
    };

    console.debug("Saved Settings", config);
    browser.storage.local.set({ config });
  });
