document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
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
