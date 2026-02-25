document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const slider = document.querySelector(".tab-content-inner");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "contact") {
        slider.style.transform = "translateX(-50%)";
      } else {
        slider.style.transform = "translateX(0%)";
      }

    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.target.classList && entry.target.classList.contains('container-projects')) {
          const projects = entry.target.querySelectorAll('.project');
          if (entry.isIntersecting) projects.forEach(p => p.classList.add('show'));
          else projects.forEach(p => p.classList.remove('show'));
          return;
        }

        if (entry.isIntersecting) entry.target.classList.add("show");
        else entry.target.classList.remove("show");
      });
    },
    { threshold: 0.3 }
  );


  document.querySelectorAll(".language-container, .container-projects, .information")
    .forEach(el => observer.observe(el));
});
