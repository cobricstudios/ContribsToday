async function getConfig() {
  try {
    const result = await browser.storage.local.get("config");
    return result.config;
  } catch (error) {
    console.error("Error retrieving config:", error);
  }
}
(async () => {
  if (!(await getConfig())) {
    const configDefault = { username: "", ghToken: "", badge: false };
    config = configDefault;
    browser.storage.local.set({
      config: configDefault,
    });
  }
})();

browser.browserAction.onClicked.addListener(async () => {
  const username = (await getConfig()).usernmame;
  browser.tabs.create({
    url: "https://github.com/" + username,
  });
});

async function update() {
  const config = await getConfig();

  let contributions = null;
  try {
    contributions = await fetchContributions();
    // TODO: remove this before pushing
  } catch (e) {
    console.error(e);
    return;
  }

  if (config.badge || true) {
    browser.browserAction.setBadgeText({ text: contributions.toString() });
  }

  let currentIcon128 = "";
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
  console.log("Data", data);

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

setInterval(update, 18000);
