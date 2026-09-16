window.CareAlert = (function () {
  var ready = false;
  var ctx = null;
  var seen = {};
  var firstLoad = true;

  function typeIcon(type) {
    type = type || '';
    if (type.indexOf('紧急') >= 0) return '🚨';
    if (type.indexOf('痛') >= 0 || type.indexOf('疼') >= 0) return '😣';
    if (type.indexOf('喝水') >= 0) return '💧';
    if (type.indexOf('翻身') >= 0) return '🔄';
    if (type.indexOf('冷') >= 0 || type.indexOf('热') >= 0) return '🌡️';
    if (type.indexOf('便') >= 0 || type.indexOf('如厕') >= 0) return '🚽';
    if (type.indexOf('胃管') >= 0) return '🩺';
    if (type.indexOf('家人') >= 0) return '👨‍👩‍👧';
    return '📢';
  }

  function enable() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      ready = true;
      if (window.Notification && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      var b = document.getElementById('enableAlert');
      if (b) { b.innerText = '声音已开启'; b.style.background = '#2e7d32'; }
    } catch (e) {}
  }

  function beep() {
    if (!ctx) return;
    var now = ctx.currentTime;
    [0, 0.35, 0.7].forEach(function (off) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = off === 0.35 ? 880 : 660;
      g.gain.setValueAtTime(0.0001, now + off);
      g.gain.exponentialRampToValueAtTime(0.25, now + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.28);
      o.connect(g); g.connect(ctx.destination);
      o.start(now + off); o.stop(now + off + 0.3);
    });
    if (navigator.vibrate) navigator.vibrate([300, 120, 300, 120, 400]);
  }

  function showOverlay(need) {
    var old = document.getElementById('alertOverlay');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'alertOverlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(183,28,28,0.96);color:#fff;z-index:99;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;';
    el.innerHTML = '<div style="font-size:96px;line-height:1;">' + typeIcon(need.type) + '</div>' +
      '<div style="font-size:28px;font-weight:700;margin:16px 0 8px;">' + (need.elder_name || '老人') + '</div>' +
      '<div style="font-size:32px;font-weight:700;">' + (need.type || '新需求') + '</div>' +
      '<div style="margin-top:16px;opacity:.9;">请马上查看并处理</div>' +
      '<button id="closeAlert" style="margin-top:28px;padding:14px 28px;font-size:18px;border:none;border-radius:12px;background:#fff;color:#c62828;">知道了</button>';
    document.body.appendChild(el);
    document.getElementById('closeAlert').onclick = function () { el.remove(); if (ctx && ctx.state === 'suspended') ctx.resume(); };
  }

  function notifyNew(need) {
    beep();
    showOverlay(need);
    if (window.Notification && Notification.permission === 'granted') {
      try { new Notification((need.elder_name || '老人') + '需要帮助', { body: need.type || '新需求', silent: false }); } catch (e) {}
    }
  }

  function check(items) {
    var newestPending = items.filter(function (n) { return n.status === 'pending'; });
    if (firstLoad) {
      newestPending.forEach(function (n) { seen[n.id || n.created_at] = true; });
      firstLoad = false;
      return;
    }
    newestPending.forEach(function (n) {
      var key = n.id || String(n.created_at);
      if (!seen[key]) {
        seen[key] = true;
        notifyNew(n);
      }
    });
  }

  return { enable: enable, check: check, typeIcon: typeIcon };
})();
