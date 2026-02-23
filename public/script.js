async function loadData() {
  try {
    const res = await fetch("/data");

    if (!res.ok) {
      throw new Error("Không thể tải dữ liệu từ server");
    }

    const db = await res.json();

    const menu = document.getElementById("menu");
    const content = document.getElementById("content");

    if (!menu || !content) {
      console.error("Không tìm thấy #menu hoặc #content trong HTML");
      return;
    }

    menu.innerHTML = "";
    content.innerHTML = "";

    // Kiểm tra cấu trúc dữ liệu
    if (!db.tabs || typeof db.tabs !== "object") {
      content.innerHTML = "<p>Dữ liệu không hợp lệ.</p>";
      return;
    }

    const tabNames = Object.keys(db.tabs);

    if (tabNames.length === 0) {
      content.innerHTML = "<p>Chưa có nội dung.</p>";
      return;
    }

    // Hàm render nội dung tab
    function renderTab(tabName, btn) {

      // Reset màu tất cả nút
      document.querySelectorAll("#menu button")
        .forEach(b => b.style.background = "#145a32");

      // Highlight nút đang chọn
      if (btn) {
        btn.style.background = "#1e8449";
      }

      content.innerHTML = `<h2>${tabName}</h2>`;

      const items = db.tabs[tabName];

      if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
          const box = document.createElement("div");
          box.style.marginBottom = "15px";
          box.style.padding = "15px";
          box.style.background = "#f8f9fa";
          box.style.borderLeft = "5px solid #145a32";
          box.style.borderRadius = "6px";
          box.innerHTML = item;

          content.appendChild(box);
        });
      } else {
        content.innerHTML += "<p>Chưa có nội dung cho mục này.</p>";
      }
    }

    // Tạo menu
    tabNames.forEach(tabName => {
      const btn = document.createElement("button");
      btn.innerText = tabName;
      btn.style.background = "#145a32";
      btn.style.color = "white";
      btn.style.marginRight = "5px";
      btn.style.padding = "6px 12px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";

      btn.onclick = () => renderTab(tabName, btn);

      menu.appendChild(btn);
    });

    // Mở tab đầu tiên mặc định
    const firstButton = menu.querySelector("button");
    if (firstButton) {
      firstButton.click();
    }

  } catch (err) {
    console.error("Lỗi loadData:", err);
    const content = document.getElementById("content");
    if (content) {
      content.innerHTML = "<p>Lỗi tải dữ liệu. Kiểm tra console để biết chi tiết.</p>";
    }
  }
}

loadData();