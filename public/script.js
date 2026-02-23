async function loadData() {
  const res = await fetch("/data");
  const db = await res.json();

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");

  menu.innerHTML = "";
  content.innerHTML = "";

  Object.keys(db.tabs).forEach(tab => {
    const btn = document.createElement("button");
    btn.innerText = tab;
    btn.onclick = () => renderTab(tab);
    menu.appendChild(btn);
  });

  function renderTab(tab) {
    content.innerHTML = `<h2>${tab}</h2>`;
    db.tabs[tab].forEach(item => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = item;
      content.appendChild(div);
    });
  }
}

loadData();

/* Drag & Drop Logo */
const dropArea = document.getElementById("logoDrop");

dropArea.addEventListener("dragover", e => e.preventDefault());

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    dropArea.innerHTML = `<img src="${evt.target.result}" height="80">`;
  };
  reader.readAsDataURL(file);
});