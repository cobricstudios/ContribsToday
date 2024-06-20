async function getConfig() {
  try {
    const result = await browser.storage.local.get("config");
    return result.config;
  } catch (error) {
    console.error("Error retrieving config:", error);
  }
}
(async () => {
  const configExists = await getConfig();

  if (!configExists) {
    const configDefault = {
      username: "",
      ghToken: "",
      badge: false,
      badgeColor: "",
    };
    browser.storage.local.set({
      config: configDefault,
    });
  }

  const config = await getConfig();
  browser.browserAction.setBadgeBackgroundColor({
    color: config.badgeColor || "#000",
  });
  update();
})();

browser.browserAction.onClicked.addListener(async () => {
  const config = await getConfig();

  browser.tabs.create({
    url: "https://github.com/" + config.username,
  });
});

async function update() {
  const config = await getConfig();

  let contributions = null;
  try {
    contributions = await fetchContributions();
  } catch (e) {
    console.error(e);
    return;
  }

  if (config.badge) {
    browser.browserAction.setBadgeText({ text: contributions.toString() });
  } else {
    browser.browserAction.setBadgeText({ text: "" });
  }

  let currentIcon128;
  if (contributions <= 0) {
    currentIcon128 = "icon-0-128px.png";
  } else if (contributions > 0 && contributions < 4) {
    currentIcon128 = "icon-1-128px.png";
  } else if (contributions >= 4 && contributions < 8) {
    currentIcon128 = "icon-2-128px.png";
  } else if (contributions >= 8 && contributions < 12) {
    currentIcon128 = "icon-3-128px.png";
  } else if (contributions >= 12) {
    currentIcon128 = "icon-4-128px.png";
  }

  browser.browserAction.setIcon({
    path: {
      128: "icons/" + currentIcon128,
    },
  });
}

async function fetchContributions() {
  const config = await getConfig();

  if (!config.username || !config.ghToken) {
    throw new Error(
      "Error fetching GitHub contributions: No token or username provided: " +
        JSON.stringify(config),
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.ghToken}`,
  };
  const body = JSON.stringify({
    query: `
      query getUserContributions($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
      `,
    variables: { username: config.username },
  });

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: headers,
    body: body,
  });

  const data = await response.json();

  const contributionWeek =
    data.data.user.contributionsCollection.contributionCalendar.weeks[
      data.data.user.contributionsCollection.contributionCalendar.weeks.length -
        1
    ];
  const contributionCount =
    contributionWeek.contributionDays[
      contributionWeek.contributionDays.length - 1
    ].contributionCount;

  return contributionCount;
}

setInterval(update, 30000);
