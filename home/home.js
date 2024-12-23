function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

function changeLanguage(select) {
    let language = select.options[select.selectedIndex].text;
    alert('Selected Language: ' + language);
}
