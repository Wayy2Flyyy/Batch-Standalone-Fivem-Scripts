const healthBadge = document.querySelector("[data-health-status]");

async function updateHealthBadge() {
  if (!healthBadge) {
    return;
  }

  try {
    const response = await fetch("/healthz");
    const body = await response.json();

    if (!response.ok || body.status !== "ok") {
      throw new Error("Health check failed");
    }

    healthBadge.textContent = "API status: healthy";
    healthBadge.dataset.state = "healthy";
  } catch (error) {
    healthBadge.textContent = "API status: unavailable";
    healthBadge.dataset.state = "error";
  }
}

updateHealthBadge();
