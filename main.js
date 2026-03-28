document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer para la Tarjeta de Perfil y la Sección de Proyectos
  // Función genérica para animación de tipeo (se ejecuta una sola vez)
  const typeWriterOnce = (el, speed = 100) => {
    if (el.dataset.typingStarted) return;
    el.dataset.typingStarted = "true";
    const text = el.dataset.originalText || el.textContent.trim();
    el.textContent = "";
    el.classList.add('typing-cursor');
    let i = 0;
    const type = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.remove('typing-cursor');
      }
    };
    type();
  };

  // Preparar los headers para que no tengan texto al inicio (evita parpadeo)
  document.querySelectorAll('.about-section h2, .tech-stack h2, .project-section h2').forEach(h2 => {
    h2.dataset.originalText = h2.textContent.trim();
    h2.textContent = "";
  });

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          
          // Si la sección tiene un h2, disparamos el efecto de tipeo (excepto en la profile card)
          const h2 = entry.target.querySelector('h2');
          if (h2 && !h2.dataset.typingStarted && !entry.target.classList.contains('profile-card')) {
            typeWriterOnce(h2, 150);
          }
        } else {
          entry.target.classList.remove('show');
        }
      });
    },
    { threshold: 0.3 } // Un poco más sensible para pantallas pequeñas
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
    
    // --- Efecto Magnetic Particles (repulsión y retorno suave) ---
    let particlesArray = [];
    const mouse = { x: null, y: null, radius: 150 };

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.dx = (Math.random() - 0.5) * 0.6; // Velocidad en X
        this.dy = (Math.random() - 0.5) * 0.6; // Velocidad en Y
        
        // Color: Escala de grises minimalista (platas y humos)
        const colors = ['#a1a1aa', '#71717a', '#52525b', '#3f3f46'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Rebote en bordes
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
      }
    }

    const init = () => {
      particlesArray = [];
      // Cantidad de partículas basada en el tamaño del canvas (densidad aumentada)
      let numberOfParticles = (canvas.width * canvas.height) / 6000;
      // Límite aumentado a 300 para mantener la fluidez
      if (numberOfParticles > 300) numberOfParticles = 300;
      
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();

        // Efecto red de partículas (Constellation) - Conexión entre ellas
        for (let j = i; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distanceSq = dx * dx + dy * dy;
          
          if (distanceSq < 10000) { // Si están a menos de 100px
            let opacity = 1 - (Math.sqrt(distanceSq) / 100);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(161, 161, 170, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }

        // Conexión dinámica extra con el cursor (el mouse "teje" la red)
        if (mouse.x !== null && mouse.y !== null) {
           let dxCursor = particlesArray[i].x - mouse.x;
           let dyCursor = particlesArray[i].y - mouse.y;
           let distanceCursorSq = dxCursor * dxCursor + dyCursor * dyCursor;
           
           if (distanceCursorSq < 22500) { // a menos de 150px del mouse
              let opacity = 1 - (Math.sqrt(distanceCursorSq) / 150);
              ctx.beginPath();
              // Línea ligeramente más opaca para resaltar la interacción
              ctx.strokeStyle = `rgba(161, 161, 170, ${opacity * 0.7})`;
              ctx.lineWidth = 1.2;
              ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
              ctx.closePath();
           }
        }
      }
      requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      init(); // Re-inicializar constelación

    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();
  }

  // --- Animación de Tipeo para el Hero (H1) ---
  const heroH1 = document.querySelector('.presentation h1');
  let startHeroTyping = () => {};

  if (heroH1) {
    // Texto a simular que se escribe
    const textToType = "Hi, I'm Alex Alvez";
    
    // Preparar el elemento limpiando y SIN cursor inicial
    heroH1.textContent = "";

    startHeroTyping = () => {
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

      // Comenzar animación text H1
      setTimeout(typeWriter, 500);
      
      // Mostrar el subtitulo deslizando desde abajo
      setTimeout(() => {
        const glitchWrapper = document.querySelector('.glitch-wrapper');
        if (glitchWrapper) glitchWrapper.classList.add('show');
      }, 500); 
    };
  }

  // --- Scroll Suave Manual para el botón de bajar ---
  const scrollIcon = document.querySelector('.scroll-down-icon');
  if (scrollIcon) {
    scrollIcon.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = scrollIcon.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const startPosition = window.pageYOffset || window.scrollY;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        const duration = 800; 
        let start = null;

    
        const easeInOutCubic = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        };

        const animation = (currentTime) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(animation);
          } else {
            window.scrollTo(0, targetPosition);
          }
        };

        requestAnimationFrame(animation);
      }
    });
  }

  // --- Terminal Interactiva ---
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInputLine = document.getElementById('terminal-input-line');
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  // Bloquear scroll hasta que cargue la consola
  document.body.classList.add('no-scroll');

  if (terminalOutput && terminalInput && terminalBody) {

    const addLine = (html, extraClass = '') => {
      const line = document.createElement('div');
      line.className = 'terminal-line' + (extraClass ? ` ${extraClass}` : '');
      line.innerHTML = html;
      terminalOutput.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    };



    // Líneas de la secuencia de arranque
    const bootSequence = [
      { html: '> <span class="cmd">npm start alex-portfolio</span>', delay: 500 },
      { html: '', delay: 200 },
      { html: '<span class="dim">[..........] / installing dependencies</span>', delay: 700 },
      { html: '<span class="dim">[##########] ✓ dependencies ready</span>', delay: 500 },
      { html: '', delay: 150 },
      { html: '&nbsp;&nbsp;<span class="dim">⊙</span> Compiling modules...', delay: 400 },
      { html: '&nbsp;&nbsp;<span class="dim">⊙</span> Building portfolio...', delay: 400 },
      { html: '&nbsp;&nbsp;<span class="dim">⊙</span> Starting dev server...', delay: 400 },
      { html: '', delay: 200 },
      { html: '<span class="green">  ✓ Portfolio is running successfully!</span>', delay: 100 },
      { html: '', delay: 300 },
      { html: '<span class="yellow">  Type \'help\' to see available commands.</span>', delay: 100 },
      { html: '', delay: 200 },
    ];

    // Ejecutar secuencia de arranque, luego mostrar input
    let bootIndex = 0;
    const runBoot = () => {
      if (bootIndex < bootSequence.length) {
        const item = bootSequence[bootIndex];
        addLine(item.html);
        bootIndex++;
        setTimeout(runBoot, item.delay);
      } else {
        // Mostrar línea de entrada
        terminalInputLine.style.display = 'flex';
        terminalInput.focus();
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        // Mover terminal a la derecha y expandir texto
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.remove('booting');

        // Disparar la animación de texto del Hero al terminar la terminal
        startHeroTyping();

        // Desbloquear scroll y mostrar flecha + nav
        document.body.classList.remove('no-scroll');
        const scrollArrow = document.querySelector('.scroll-down-icon');
        if (scrollArrow) scrollArrow.classList.add('show');
        const iconNav = document.getElementById('icon-nav');
        if (iconNav) iconNav.classList.add('show');
      }
    };

    // Iniciar arranque con un pequeño retraso
    setTimeout(runBoot, 800);

    // Hacer click en cualquier parte del body del terminal para enfocar el input
    terminalBody.addEventListener('click', () => {
      if (terminalInputLine.style.display !== 'none') {
        terminalInput.focus();
      }
    });

    // Manejo de comandos
    const commands = {
      about: () => {
        addLine('');
        addLine("<span class='cyan'>Full Stack Developer from Argentina. Currently 4th year Bachelor's Degree in Systems student at UADER. Passionate about building modern web apps</span>");
        addLine('');
      },
      skills: () => {
        addLine('');
        addLine('  <span class="cyan">Front:</span>      <span class="cmd">HTML · CSS · JavaScript · TypeScript</span>');
        addLine('  <span class="cyan">Back:</span>       <span class="cmd">Python · Node.js · PostgreSQL</span>');
        addLine('  <span class="cyan">Frameworks:</span> <span class="cmd">React · Express · NestJS · Tailwind</span>');
        addLine('  <span class="cyan">IA Tools:</span>   <span class="cmd">Codex · Claude · Gemini</span>');
        addLine('  <span class="cyan">Tools:</span>      <span class="cmd">GitHub · Docker · Postman</span>');
        addLine('');
      },
      projects: () => {
        addLine('');
        addLine('  <span class="cyan">1.</span> <span class="cmd">Task Management App</span>');
        addLine('  <span class="cyan">2.</span> <span class="cmd">Amargo y Dulce (E-commerce)</span>');
        addLine('');
        addLine('  <span class="yellow">↓ Scroll down to see more</span>');
        addLine('');
      },
      contact: () => {
        addLine('');
        addLine('  <span class="cyan">Email:   alexfalvez001@gmail.com</span>');
        addLine('  <span class="cyan">Phone:   +54 9 3442 66-8413</span>');
        addLine('');
      },
      help: () => {
        addLine('');
        addLine('<span class="cyan">  Available commands:</span>');
        addLine('  <span class="cmd">about </span>    <span class="dim">View my information</span>');
        addLine('  <span class="cmd">skills </span>   <span class="dim">View my tech stack</span>');
        addLine('  <span class="cmd">projects </span> <span class="dim">View my projects</span>');
        addLine('  <span class="cmd">contact </span>  <span class="dim">View my contact information</span>');
        addLine('  <span class="cmd">clear </span>    <span class="dim">Clear this terminal</span>');
        addLine('  <span class="cmd">help </span>     <span class="dim">Show this help menu</span>');
        addLine('');
      },
      clear: () => {
        terminalOutput.innerHTML = '';
      }
    };

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = terminalInput.value.trim().toLowerCase();
        
        // Repetir el comando escrito
        addLine(`<span class="cmd">visitor@alex&gt;</span> ${value || ' '}`);
        terminalInput.value = '';

        if (value === '') return;

        if (commands[value]) {
          setTimeout(() => commands[value](), 300);
        } else {
          addLine(`<span class="pink">  Command not found: '${value}'. Type 'help' for available commands.</span>`);
        }
      }
    });
  }

  // --- Scroll Spy para el Nav ---
  const navLinks = document.querySelectorAll('.nav-icon');
  const sections = document.querySelectorAll('#hero, #about-section, #tech-section, #projects-section');

  if (navLinks.length && sections.length) {
    const setActive = (id) => {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => spyObserver.observe(section));
  }
});
