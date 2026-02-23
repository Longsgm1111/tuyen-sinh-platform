async function loadData() {
  const menu = document.getElementById("menu");
  const content = document.getElementById("content");

  try {
    const res = await fetch("/data");
    const db = await res.json();

    if (!db.tabs) {
      content.innerHTML = "<p>Chưa có dữ liệu.</p>";
      return;
    }

    menu.innerHTML = "";
    content.innerHTML = "";

    function renderTab(tab) {
      content.innerHTML = `<h2>${tab}</h2>`;
      db.tabs[tab].forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = item;
        content.appendChild(div);
      });
    }

    Object.keys(db.tabs).forEach(tab => {
      const btn = document.createElement("button");
      btn.innerText = tab;
      btn.onclick = () => renderTab(tab);
      menu.appendChild(btn);
    });

    // ✅ Tự động mở tab đầu tiên (tránh trắng trang)
    const firstTab = Object.keys(db.tabs)[0];
    if (firstTab) renderTab(firstTab);

  } catch (err) {
    content.innerHTML = "<p>Không thể tải dữ liệu từ server.</p>";
    console.error(err);
  }
}

loadData();

/* =========================
   Drag & Drop Logo (Có lưu lại)
========================= */

const dropArea = document.getElementById("logoDrop");

// Load logo đã lưu
const savedLogo = localStorage.getItem("siteLogo");
if (savedLogo) {
  dropArea.innerHTML = `<img src="${savedLogo}" height="80">`;
}

dropArea.addEventListener("dragover", e => e.preventDefault());

dropArea.addEventListener("drop", e => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = evt.target.result;
    dropArea.innerHTML = `<img src="${img}" height="80">`;
    localStorage.setItem("siteLogo", img);
  };
  reader.readAsDataURL(file);
});