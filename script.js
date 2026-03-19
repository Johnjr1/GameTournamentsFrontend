const tournamentDiv = document.getElementById("tournament");
const tournamentForm = document.getElementById("tournamentForm");
const gameForm = document.getElementById("gameForm");
const gameTournamentIdSelect = document.getElementById("gameTournamentId");
const toastContainer = document.getElementById("toastContainer");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const modalTitle = document.getElementById("modalTitle");

const editTypeInput = document.getElementById("editType");
const editIdInput = document.getElementById("editId");

const editTournamentFields = document.getElementById("editTournamentFields");
const editGameFields = document.getElementById("editGameFields");

const editTournamentTitle = document.getElementById("editTournamentTitle");
const editTournamentDescription = document.getElementById("editTournamentDescription");
const editTournamentMaxPlayers = document.getElementById("editTournamentMaxPlayers");
const editTournamentDate = document.getElementById("editTournamentDate");

const editGameTitle = document.getElementById("editGameTitle");
const editGameTime = document.getElementById("editGameTime");
const editGameTournamentId = document.getElementById("editGameTournamentId");

const BASE_URL = "https://localhost:7003";

async function loadTournamentsAndGames() {
  tournamentDiv.innerHTML = `<div class="loading">Laddar turneringar och matcher...</div>`;

  try {
    const [tournamentsResponse, gamesResponse] = await Promise.all([
      fetch(`${BASE_URL}/api/tournaments`),
      fetch(`${BASE_URL}/api/games`)
    ]);

    if (!tournamentsResponse.ok) {
      throw new Error(`Kunde inte hämta turneringar: ${tournamentsResponse.status}`);
    }

    if (!gamesResponse.ok) {
      throw new Error(`Kunde inte hämta matcher: ${gamesResponse.status}`);
    }

    const tournaments = await tournamentsResponse.json();
    const games = await gamesResponse.json();

    populateTournamentSelect(tournaments);
    populateEditTournamentSelect(tournaments);

    if (!tournaments || tournaments.length === 0) {
      tournamentDiv.innerHTML = `
        <div class="empty-state">
          <h2>Inga turneringar hittades</h2>
          <p>Det finns inga turneringar att visa just nu.</p>
        </div>
      `;
      return;
    }

    tournamentDiv.innerHTML = tournaments.map(tournament => {
      const tournamentGames = games.filter(game => game.tournamentId === tournament.id);

      const safeTournamentJson = encodeURIComponent(JSON.stringify(tournament));

      return `
        <article class="card">
          <div class="card-header">
            <div class="card-title-group">
              <h2>${escapeHtml(tournament.title)}</h2>
              <p>${escapeHtml(tournament.description || "Ingen beskrivning tillgänglig.")}</p>
            </div>
            <div class="badge">Aktiv turnering</div>
          </div>

          <div class="meta">
            <div class="meta-box">
              <span class="meta-label">Max spelare</span>
              <span class="meta-value">${tournament.maxPlayers}</span>
            </div>
            <div class="meta-box">
              <span class="meta-label">Datum</span>
              <span class="meta-value">${formatDate(tournament.date)}</span>
            </div>
            <div class="meta-box">
              <span class="meta-label">Antal matcher</span>
              <span class="meta-value">${tournamentGames.length}</span>
            </div>
          </div>

          <h3 class="matches-title">Matcher</h3>

          ${
            tournamentGames.length > 0
              ? `<div class="games-list">
                  ${tournamentGames.map(game => {
                    const safeGameJson = encodeURIComponent(JSON.stringify(game));

                    return `
                      <div class="game-card">
                        <p class="game-title">${escapeHtml(game.title)}</p>
                        <p class="game-time">Tid: ${formatGameTime(game.time)}</p>
                        <div class="actions">
                          <button
                            class="action-btn edit-btn"
                            onclick="openEditGameModalFromEncoded('${safeGameJson}')">
                            Redigera
                          </button>
                          <button class="action-btn delete-btn" onclick="deleteGame(${game.id})">
                            Ta bort
                          </button>
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>`
              : `<p class="game-time">Inga matcher för denna turnering.</p>`
          }

          <div class="actions">
            <button
              class="action-btn edit-btn"
              onclick="openEditTournamentModalFromEncoded('${safeTournamentJson}')">
              Redigera turnering
            </button>
            <button class="action-btn delete-btn" onclick="deleteTournament(${tournament.id})">
              Ta bort turnering
            </button>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    console.error(error);
    tournamentDiv.innerHTML = `
      <div class="error-state">
        <h2>Något gick fel</h2>
        <p>Datan kunde inte laddas just nu. Kontrollera att API:et körs och försök igen.</p>
      </div>
    `;
    showMessage("Kunde inte ladda data från API:et.", "error", "Laddning misslyckades");
  }
}

function populateTournamentSelect(tournaments) {
  gameTournamentIdSelect.innerHTML = `
    <option value="">Välj turnering</option>
    ${tournaments.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join("")}
  `;
}

function populateEditTournamentSelect(tournaments) {
  editGameTournamentId.innerHTML = `
    <option value="">Välj turnering</option>
    ${tournaments.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join("")}
  `;
}

function showMessage(text, type = "success", title = "") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const toastTitle = title || (type === "success" ? "Klart" : "Något gick fel");

  toast.innerHTML = `
    <button class="toast-close" aria-label="Stäng meddelande">✕</button>
    <span class="toast-title">${escapeHtml(toastTitle)}</span>
    <div class="toast-message">${escapeHtml(text)}</div>
    <div class="toast-progress"></div>
  `;

  toastContainer.appendChild(toast);

  const removeToast = () => {
    if (!toast.parentElement) return;
    toast.classList.add("removing");
    setTimeout(() => {
      toast.remove();
    }, 200);
  };

  toast.querySelector(".toast-close").addEventListener("click", removeToast);
  setTimeout(removeToast, 3200);
}

function formatGameTime(time) {
  const date = new Date(time);

  if (isNaN(date.getTime())) {
    return time;
  }

  return date.toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function formatDate(dateValue) {
  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function toInputDateTime(dateValue) {
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function getErrorMessage(response, fallbackMessage) {
  try {
    const errorData = await response.json();

    if (errorData?.errors) {
      const firstErrorArray = Object.values(errorData.errors)[0];
      if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
        return firstErrorArray[0];
      }
    }

    if (errorData?.title) {
      return errorData.title;
    }

    if (errorData?.message) {
      return errorData.message;
    }

    return fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function openEditTournamentModalFromEncoded(encodedTournament) {
  try {
    const tournament = JSON.parse(decodeURIComponent(encodedTournament));
    openEditTournamentModal(tournament);
  } catch (error) {
    console.error(error);
    showMessage("Kunde inte öppna redigering för turneringen.", "error", "Fel");
  }
}

function openEditGameModalFromEncoded(encodedGame) {
  try {
    const game = JSON.parse(decodeURIComponent(encodedGame));
    openEditGameModal(game);
  } catch (error) {
    console.error(error);
    showMessage("Kunde inte öppna redigering för matchen.", "error", "Fel");
  }
}

function openEditTournamentModal(tournament) {
  modalTitle.textContent = "Redigera turnering";
  editTypeInput.value = "tournament";
  editIdInput.value = tournament.id;

  editTournamentFields.classList.remove("hidden");
  editGameFields.classList.add("hidden");

  editTournamentTitle.value = tournament.title || "";
  editTournamentDescription.value = tournament.description || "";
  editTournamentMaxPlayers.value = tournament.maxPlayers ?? "";
  editTournamentDate.value = toInputDateTime(tournament.date);

  editModal.classList.remove("hidden");
}

function openEditGameModal(game) {
  modalTitle.textContent = "Redigera match";
  editTypeInput.value = "game";
  editIdInput.value = game.id;

  editTournamentFields.classList.add("hidden");
  editGameFields.classList.remove("hidden");

  editGameTitle.value = game.title || "";
  editGameTime.value = toInputDateTime(game.time);
  editGameTournamentId.value = game.tournamentId ?? "";

  editModal.classList.remove("hidden");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editForm.reset();
}

tournamentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("tournamentTitle").value.trim();
  const description = document.getElementById("tournamentDescription").value.trim();
  const maxPlayersValue = parseInt(document.getElementById("tournamentMaxPlayers").value, 10);
  const dateValue = document.getElementById("tournamentDate").value;
  const selectedDate = new Date(dateValue);

  if (title.length < 3) {
    showMessage("Titeln måste vara minst 3 tecken.", "error", "Ogiltig titel");
    return;
  }

  if (isNaN(maxPlayersValue)) {
    showMessage("Max spelare måste vara ett giltigt nummer.", "error", "Ogiltigt värde");
    return;
  }

  if (isNaN(selectedDate.getTime())) {
    showMessage("Välj ett giltigt datum.", "error", "Ogiltigt datum");
    return;
  }

  if (selectedDate <= new Date()) {
    showMessage("Datumet måste ligga i framtiden.", "error", "Ogiltigt datum");
    return;
  }

  const payload = {
    title,
    description,
    maxPlayers: maxPlayersValue,
    date: dateValue
  };

  try {
    const response = await fetch(`${BASE_URL}/api/tournaments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response, "Kunde inte skapa turnering.");
      showMessage(errorMessage, "error", "Skapande misslyckades");
      return;
    }

    tournamentForm.reset();
    showMessage("Turneringen skapades utan problem.", "success", "Turnering skapad");
    loadTournamentsAndGames();
  } catch (error) {
    console.error(error);
    showMessage("Misslyckades med att skapa turnering.", "error", "Skapande misslyckades");
  }
});

gameForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("gameTitle").value.trim();
  const timeValue = document.getElementById("gameTime").value;
  const tournamentIdValue = parseInt(document.getElementById("gameTournamentId").value, 10);
  const selectedTime = new Date(timeValue);

  if (title.length < 3) {
    showMessage("Matchtiteln måste vara minst 3 tecken.", "error", "Ogiltig titel");
    return;
  }

  if (isNaN(selectedTime.getTime())) {
    showMessage("Välj en giltig tid för matchen.", "error", "Ogiltig tid");
    return;
  }

  if (isNaN(tournamentIdValue)) {
    showMessage("Du måste välja en turnering.", "error", "Välj turnering");
    return;
  }

  const payload = {
    title,
    time: timeValue,
    tournamentId: tournamentIdValue
  };

  try {
    const response = await fetch(`${BASE_URL}/api/games`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response, "Kunde inte skapa match.");
      showMessage(errorMessage, "error", "Skapande misslyckades");
      return;
    }

    gameForm.reset();
    showMessage("Matchen skapades utan problem.", "success", "Match skapad");
    loadTournamentsAndGames();
  } catch (error) {
    console.error(error);
    showMessage("Misslyckades med att skapa match.", "error", "Skapande misslyckades");
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = editTypeInput.value;
  const id = editIdInput.value;

  if (type === "tournament") {
    const title = editTournamentTitle.value.trim();
    const description = editTournamentDescription.value.trim();
    const maxPlayers = parseInt(editTournamentMaxPlayers.value, 10);
    const date = editTournamentDate.value;
    const parsedDate = new Date(date);

    if (title.length < 3) {
      showMessage("Titeln måste vara minst 3 tecken.", "error", "Ogiltig titel");
      return;
    }

    if (isNaN(maxPlayers)) {
      showMessage("Max spelare måste vara ett giltigt nummer.", "error", "Ogiltigt värde");
      return;
    }

    if (isNaN(parsedDate.getTime())) {
      showMessage("Välj ett giltigt datum.", "error", "Ogiltigt datum");
      return;
    }

    if (parsedDate <= new Date()) {
      showMessage("Datumet måste ligga i framtiden.", "error", "Ogiltigt datum");
      return;
    }

    const payload = {
      title,
      description,
      maxPlayers,
      date
    };

    try {
      const response = await fetch(`${BASE_URL}/api/tournaments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response, "Kunde inte uppdatera turneringen.");
        showMessage(errorMessage, "error", "Uppdatering misslyckades");
        return;
      }

      closeEditModal();
      showMessage("Turneringen uppdaterades.", "success", "Turnering uppdaterad");
      loadTournamentsAndGames();
    } catch (error) {
      console.error(error);
      showMessage("Misslyckades med att uppdatera turneringen.", "error", "Uppdatering misslyckades");
    }
  }

  if (type === "game") {
    const title = editGameTitle.value.trim();
    const time = editGameTime.value;
    const tournamentId = parseInt(editGameTournamentId.value, 10);
    const parsedTime = new Date(time);

    if (title.length < 3) {
      showMessage("Matchtiteln måste vara minst 3 tecken.", "error", "Ogiltig titel");
      return;
    }

    if (isNaN(parsedTime.getTime())) {
      showMessage("Välj en giltig tid för matchen.", "error", "Ogiltig tid");
      return;
    }

    if (isNaN(tournamentId)) {
      showMessage("Du måste välja en turnering.", "error", "Välj turnering");
      return;
    }

    const payload = {
      title,
      time,
      tournamentId
    };

    try {
      const response = await fetch(`${BASE_URL}/api/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response, "Kunde inte uppdatera matchen.");
        showMessage(errorMessage, "error", "Uppdatering misslyckades");
        return;
      }

      closeEditModal();
      showMessage("Matchen uppdaterades.", "success", "Match uppdaterad");
      loadTournamentsAndGames();
    } catch (error) {
      console.error(error);
      showMessage("Misslyckades med att uppdatera matchen.", "error", "Uppdatering misslyckades");
    }
  }
});

async function deleteTournament(id) {
  const confirmed = confirm("Vill du verkligen ta bort turneringen?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${BASE_URL}/api/tournaments/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response, "Kunde inte ta bort turneringen.");
      showMessage(errorMessage, "error", "Radering misslyckades");
      return;
    }

    showMessage("Turneringen har tagits bort.", "success", "Turnering borttagen");
    loadTournamentsAndGames();
  } catch (error) {
    console.error(error);
    showMessage("Misslyckades med att ta bort turneringen.", "error", "Radering misslyckades");
  }
}

async function deleteGame(id) {
  const confirmed = confirm("Vill du verkligen ta bort matchen?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${BASE_URL}/api/games/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response, "Kunde inte ta bort matchen.");
      showMessage(errorMessage, "error", "Radering misslyckades");
      return;
    }

    showMessage("Matchen har tagits bort.", "success", "Match borttagen");
    loadTournamentsAndGames();
  } catch (error) {
    console.error(error);
    showMessage("Misslyckades med att ta bort matchen.", "error", "Radering misslyckades");
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editModal.classList.contains("hidden")) {
    closeEditModal();
  }
});

loadTournamentsAndGames();