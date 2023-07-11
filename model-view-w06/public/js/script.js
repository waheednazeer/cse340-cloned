const mainnav = document.getElementsByTagName("ul")[1];
const hambutton = mainnav.getElementsByTagName("li")[0];

hambutton.addEventListener('click', () => {mainnav.classList.toggle('responsive')}, false);

