const footer = document.querySelector("footer");

// Functie voor het correcte copyright jaar.
const footerText = () => {
    let year = new Date;
    year = year.getFullYear();
    footer.innerText = `© ${year} Nynke van der Eems, Martijn Huls, Jitse Ritskes, Dylan Sealy, Alida Terwisscha van Scheltinga, Jelte Venema`;
}

footerText();