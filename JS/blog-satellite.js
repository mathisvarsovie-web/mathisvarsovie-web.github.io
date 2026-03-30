// Gestion des onglets (Tabs)
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Fonction pour gérer l'apparition au scroll (Reveal)
function reveal() {
    const reveals = document.querySelectorAll(".reveal-left, .reveal-right");
    
    reveals.forEach(windowReveal => {
        const windowHeight = window.innerHeight;
        const elementTop = windowReveal.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            windowReveal.classList.add("active");
        }
    });
}

window.addEventListener("load", reveal);
window.addEventListener("scroll", reveal);
window.onscroll = function() {
    // Barre de progression
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";

    // Apparition au scroll
    const reveals = document.querySelectorAll(".reveal-left, .reveal-right");
    reveals.forEach(el => {
        let windowHeight = window.innerHeight;
        let elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
};

// Lancer une fois au chargement
window.onload = () => window.onscroll();