(function () {
  var PASS = "care2026";
  if (localStorage.getItem("v3gate") === PASS) return;
  var wall = document.createElement("div");
  wall.style.cssText = "position:fixed;inset:0;background:#fff;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:-apple-system,sans-serif";
  wall.innerHTML = '<div style="width:280px;padding:16px"><div style="font-size:20px;font-weight:700;margin-bottom:8px">请输入试用密码</div><input id="v3pw" type="password" style="width:100%;padding:12px;font-size:18px;border:1px solid #ddd;border-radius:10px"><button id="v3go" style="width:100%;margin-top:10px;padding:12px;border:0;border-radius:10px;background:#1565c0;color:#fff;font-size:16px">进入</button><p id="v3err" style="color:#c62828;font-size:14px"></p></div>';
  document.documentElement.appendChild(wall);
  function check() {
    var v = document.getElementById("v3pw").value.trim();
    if (v === PASS) { localStorage.setItem("v3gate", PASS); wall.remove(); }
    else document.getElementById("v3err").textContent = "密码不对";
  }
  document.getElementById("v3go").onclick = check;
  document.getElementById("v3pw").addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
})();
