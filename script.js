
(() => {
  const screens = [...document.querySelectorAll(".screen")];
  const beginBtn = document.getElementById("beginBtn");
  const subjectCards = [...document.querySelectorAll(".subject-card")];
  const progressText = document.getElementById("progressText");
  const questionPanel = document.getElementById("questionPanel");
  const quizForm = document.getElementById("quizForm");
  const feedback = document.getElementById("feedback");
  const archiveBtn = document.getElementById("archiveBtn");
  const restartBtn = document.getElementById("restartBtn");

  const revealed = new Set();

  function showScreen(id) {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    document.getElementById(id).focus?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  beginBtn.addEventListener("click", () => showScreen("evidence"));

  subjectCards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.subject;
      if (!revealed.has(id)) {
        revealed.add(id);
        card.classList.add("revealed");
        card.setAttribute("aria-expanded", "true");
        const status = card.querySelector(".subject-status");
        if (status) status.textContent = "REVEALED";
      }

      progressText.textContent = `${revealed.size} / 3 evidence files reviewed`;

      if (revealed.size === subjectCards.length) {
        questionPanel.classList.remove("hidden");
        progressText.textContent = "All evidence reviewed. Assessment unlocked.";
        setTimeout(() => questionPanel.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
      }
    });
  });

  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = quizForm.querySelector('input[name="answer"]:checked');

    if (!selected) {
      feedback.textContent = "Select an answer before submitting.";
      feedback.className = "feedback bad";
      return;
    }

    if (selected.value === "C") {
      feedback.textContent = "Correct. Assessment complete. Opening result…";
      feedback.className = "feedback good";
      quizForm.querySelectorAll("input,button").forEach(el => el.disabled = true);
      setTimeout(() => showScreen("result"), 750);
    } else {
      const hints = {
        A: "Surface judgment detected. Look beneath the label.",
        B: "No. The behaviour is not random. Ask what it may be protecting.",
        D: "That describes the outcome, not the mechanism beneath it."
      };
      feedback.textContent = hints[selected.value] || "Reassess the evidence.";
      feedback.className = "feedback bad";
    }
  });

  archiveBtn.addEventListener("click", () => showScreen("archived"));

  restartBtn.addEventListener("click", () => {
    revealed.clear();
    subjectCards.forEach(card => {
      card.classList.remove("revealed");
      card.setAttribute("aria-expanded", "false");
      const status = card.querySelector(".subject-status");
      if (status) status.textContent = "TAP TO REVEAL";
    });
    progressText.textContent = "0 / 3 evidence files reviewed";
    questionPanel.classList.add("hidden");
    quizForm.reset();
    quizForm.querySelectorAll("input,button").forEach(el => el.disabled = false);
    feedback.textContent = "";
    feedback.className = "feedback";
    showScreen("cover");
  });
})();
