document.addEventListener("DOMContentLoaded", function() {
    var contact_btn = document.querySelector('.contact-btn');
    var aboutme_btn = document.querySelector('.aboutme-btn');
    var contact = document.querySelector('.contact');
    var aboutme = document.querySelector('.aboutme');


    aboutme.classList.add("show");

    function showContact() {
        aboutme.classList.remove("show");
        aboutme.style.display = "none";
        contact.style.display = "flex";
        setTimeout(function() {
            contact.classList.add("show");
        }, 100);
    }

    function showAboutMe() {
        contact.classList.remove("show");
        contact.style.display = "none";
        aboutme.style.display = "flex";
        setTimeout(function() {
            aboutme.classList.add("show");
        }, 100);
    }

    contact_btn.addEventListener("click", showContact);
    aboutme_btn.addEventListener("click", showAboutMe);
});

document.addEventListener("DOMContentLoaded", function() {

    var projects = document.querySelector('.container-projects');
    var languages = document.querySelector('.language-container');
    var information = document.querySelector('.information');
    var projectsPosition = projects.offsetTop;
    var languagePosition = languages.offsetTop;
    var informationPosition = information.offsetTop;
    
   


    var projectItems = document.querySelectorAll('.project');

    function handleScroll() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > languagePosition - window.innerHeight / 1.2){
            languages.classList.add("show")
            
        }else{
            languages.classList.remove("show")
        }
        
        if (scrollTop > projectsPosition - window.innerHeight / 1.5) {

            projectItems.forEach(function(project) {
                project.classList.add("show")
            });

        }else {
                projectItems.forEach(function(project) {
                    project.classList.remove("show"); 
                });
            }
        
        if (scrollTop > informationPosition - window.innerHeight / 1.5) {

                information.classList.add("show")
    
        }else {
                information.classList.remove("show")
                }
    }


    window.addEventListener('scroll', handleScroll);
});