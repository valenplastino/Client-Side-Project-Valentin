let apiKey = "";

document.getElementById("save-key").addEventListener("click", () => {
  apiKey = document.getElementById("api-key").value;
  sessionStorage.setItem("soccer_api_key", apiKey);
  alert("API key saved.");
});

document.getElementById("load-data").addEventListener("click", () => {
  apiKey = sessionStorage.getItem("soccer_api_key");
  if (!apiKey) {
    alert("Please enter your API key first.");
    return;
  }

  const league = document.getElementById("league-select").value;
  const season = document.getElementById("season-select").value;

  fetchStandings(league, season);
  fetchTopScorers(league, season);
});

function fetchStandings(league, season) {
  fetch(`https://v3.football.api-sports.io/standings?league=${league}&season=${season}`, {
    headers: { "x-apisports-key": apiKey }
  })
    .then(res => res.json())
    .then(data => {
      const teams = data.response[0].league.standings[0];
      const tbody = document.querySelector("#standings-table tbody");
      tbody.innerHTML = "";
      teams.forEach(team => {
        const row = `<tr>
          <td>${team.team.name}</td>
          <td>${team.points}</td>
          <td>${team.all.win}</td>
          <td>${team.all.draw}</td>
          <td>${team.all.lose}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    });
}

function fetchTopScorers(league, season) {
  fetch(`https://v3.football.api-sports.io/players/topscorers?league=${league}&season=${season}`, {
    headers: { "x-apisports-key": apiKey }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("topscorers-list");
      list.innerHTML = "";
      data.response.slice(0, 10).forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.player.name} - ${item.statistics[0].goals.total} goals`;
        list.appendChild(li);
      });
    });
}