document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer para la Tarjeta de Perfil y la Sección de Proyectos
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    },
    { threshold: 0.3 } // Activar un poco antes para secciones grandes
  );

  const profileCard = document.querySelector(".profile-card");
  if (profileCard) sectionObserver.observe(profileCard);

  const aboutSection = document.querySelector(".about-section");
  if (aboutSection) sectionObserver.observe(aboutSection);

  const techStackSection = document.querySelector(".tech-stack");
  if (techStackSection) sectionObserver.observe(techStackSection);

  const projectSection = document.querySelector(".project-section");
  if (projectSection) sectionObserver.observe(projectSection);

  // Intersection Observer para iconos del stack tecnológico (revelación escalonada vía JS)
  const iconObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.target.classList.contains('language-container')) {
          const icons = entry.target.querySelectorAll('.language');
          if (entry.isIntersecting) {
            icons.forEach((icon, i) => {
              setTimeout(() => icon.classList.add('show'), i * 80);
            });
          } else {
            icons.forEach(icon => icon.classList.remove('show'));
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".language-container")
    .forEach(el => iconObserver.observe(el));

  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("spotlight-canvas");

  if (hero && canvas) {
    const ctx = canvas.getContext("2d");
    
    // Ajustar el tamaño del canvas para que coincida con la sección hero
    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Configuración del campo de estrellas
    const numStars = 800;
    let stars = [];
    let speed = 2; // Velocidad base

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      // Al alejar el mouse del centro, aumenta la velocidad radialmente, pero con un límite menor
      let distFromCenter = Math.sqrt(Math.pow(mouseX - canvas.width / 2, 2) + Math.pow(mouseY - canvas.height / 2, 2));
      let targetSpeed = 2 + (distFromCenter / 150); // Divisor más alto para que el incremento sea menor
      speed = Math.min(targetSpeed, 6); // Velocidad máxima tope ajustada a 6
    });

    hero.addEventListener("mouseleave", () => {
      mouseX = canvas.width / 2;
      mouseY = canvas.height / 2;
      speed = 2;
    });

    // Inicializar estrellas
    const init = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * canvas.width, // Profundidad
          pz: Math.random() * canvas.width // Profundidad previa para el rastro
        });
      }
    };

    // Renderizar la animación
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Fondo oscuro con ligero rastro
      ctx.fillStyle = "rgba(14, 13, 13, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Centro de expansión dinámico según el ratón, con efecto suavizado
      const targetCenterX = canvas.width / 2 + (canvas.width / 2 - mouseX) * 0.1;
      const targetCenterY = canvas.height / 2 + (canvas.height / 2 - mouseY) * 0.1;
      
      ctx.save();
      ctx.translate(targetCenterX, targetCenterY);

      for (let i = 0; i < numStars; i++) {
        let star = stars[i];
        
        star.pz = star.z;
        star.z -= speed;

        if (star.z < 1) {
          star.z = canvas.width;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
          star.pz = star.z;
        }

        // Proyección de perspectiva (divide x/y por z)
        let fov = 300; // Campo de visión
        let sx = (star.x / star.z) * fov;
        let sy = (star.y / star.z) * fov;
        
        // Posición anterior (rastro)
        let px = (star.x / star.pz) * fov;
        let py = (star.y / star.pz) * fov;

        // Tamaño dependiente de la profundidad
        let size = Math.max(0.1, (1 - star.z / canvas.width) * 2.5);
        
        // Color de la estrella (más brillante y opaca cerca)
        let opacity = Math.min(1, Math.max(0, 1 - star.z / canvas.width));
        // Tonos azules/blancos para las estrellas
        ctx.strokeStyle = `rgba(180, 220, 255, ${opacity})`;
        ctx.lineWidth = size;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    init();
    animate();
  }

  // --- Animación de Tipeo para el Hero (H1) ---
  const heroH1 = document.querySelector('.presentation h1');
  if (heroH1) {
    // Texto a simular que se escribe
    const textToType = "Hi, I'm Alex Alvez";
    
    // Preparar el elemento limpiando y añadiendo el cursor
    heroH1.textContent = "";
    heroH1.classList.add('typing-cursor');

    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      if (isDeleting) {
        // Borrando caracteres
        heroH1.textContent = textToType.substring(0, charIndex - 1);
        charIndex--;
      } else {
        // Escribiendo caracteres
        heroH1.textContent = textToType.substring(0, charIndex + 1);
        charIndex++;
      }

      // Definir la velocidad base
      let typeSpeed = isDeleting ? 100 : 100;

      // Comprobar si ha terminado de escribir la frase
      if (!isDeleting && charIndex === textToType.length) {
        // Pausa larga cuando termina de escribir
        typeSpeed = 3000;
        isDeleting = true;
      } 
      // Comprobar si ha terminado de borrar
      else if (isDeleting && charIndex === 0) {
        // Pausa corta antes de volver a empezar
        isDeleting = false;
        typeSpeed = 800;
      }

      setTimeout(typeWriter, typeSpeed);
    };

    // Comenzar animación con un pequeño retraso
    setTimeout(typeWriter, 1000);
  }
});

