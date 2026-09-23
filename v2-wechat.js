window.copyWechat = function (text) {
  text = text || '';
  function ok() { alert('已复制，请打开微信贴到家庭群'); }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(ok).catch(function () { prompt('请复制', text); });
  } else prompt('请复制', text);
};
