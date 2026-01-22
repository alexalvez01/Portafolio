document.addEventListener("DOMContentLoaded", () => {
  const aboutBtn = document.querySelector(".aboutme-btn");
  const contactBtn = document.querySelector(".contact-btn");
  const about = document.querySelector(".aboutme");
  const contact = document.querySelector(".contact");

  const showSection = (show, hide) => {
    hide.classList.remove("show");
    hide.style.display = "none";
    show.style.display = "flex";
    setTimeout(() => show.classList.add("show"), 100);
  };

  about.classList.add("show");

  aboutBtn.addEventListener("click", () => showSection(about, contact));
  contactBtn.addEventListener("click", () => showSection(contact, about));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show")
        else entry.target.classList.remove("show");
      });
    },
    { threshold: 0.3 }
  );

  document
    .querySelectorAll(".language-container, .project, .information")
    .forEach(el => observer.observe(el));
});
