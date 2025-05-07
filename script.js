let apiKey = "";

document.getElementById("save-key").addEventListener("click", () => {
  const userInputKey = document.getElementById("api-key").value.trim();
  if (!userInputKey) {
    alert("Please enter a valid API key.");
    return;
  }

  apiKey = userInputKey;
  sessionStorage.setItem("soccer_api_key", apiKey);
  alert("API key saved! You can now load data.");
});

document.getElementById("load-data").addEventListener("click", () => {
  apiKey = sessionStorage.getItem("soccer_api_key");
  if (!apiKey) {
    alert("Click 'Save Key' and enter your API key first.");
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
      const tbody = document.querySelector("#standings-table tbody");
      tbody.innerHTML = "";

      if (!data.response || data.response.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
        return;
      }

      const teams = data.response[0].league.standings[0];
      teams.forEach(team => {
        const row = `<tr>
          <td>
            <div class="team-flex">
              <img src="${team.team.logo}" alt="Logo">
              <span>${team.team.name}</span>
            </div>
          </td>
          <td>${team.points}</td>
          <td>${team.all.win}</td>
          <td>${team.all.draw}</td>
          <td>${team.all.lose}</td>
        </tr>`;
        tbody.innerHTML += row;
      });
    })
    .catch(err => {
      console.error("Standings error:", err);
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

      if (!data.response || data.response.length === 0) {
        list.innerHTML = "<li>No data found</li>";
        return;
      }

      data.response.slice(0, 10).forEach(player => {
        const name = player.player.name;
        const goals = player.statistics[0].goals.total;
        const photo = player.player.photo;

        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${photo}" alt="Face" 
               onerror="this.onerror=null;this.src='https://via.placeholder.com/35?text=👤';">
          <span>${name} – ${goals} goals</span>
        `;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Top scorers error:", err);
    });
}