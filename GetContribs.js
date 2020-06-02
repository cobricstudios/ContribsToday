
query {
    user(login:"krissemicolon") {
        contributionsCollection(from:"2020-06-01T00:00:00Z", to:"2020-06-01T00:00:00Z") {
            contributionCalendar{
                totalContributions
            }
        }
    }
}