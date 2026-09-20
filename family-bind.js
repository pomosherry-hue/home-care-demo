window.FamilyBind = {
  key: function (phone) {
    return String(phone || '').replace(/\s/g, '');
  },
  path: function (phone) {
    return 'families/' + this.key(phone);
  },
  load: function (db, phone, cb) {
    if (!phone) { cb({}); return; }
    db.ref(this.path(phone)).on('value', function (s) { cb(s.val() || {}); });
  },
  save: function (db, data) {
    const phone = this.key(data.elderPhone);
    if (!phone) return Promise.reject(new Error('请先填写老人电话'));
    data.elderPhone = phone;
    return db.ref(this.path(phone)).update(data);
  },
  tel: function (phone) {
    if (!phone) { alert('请先绑定电话'); return; }
    location.href = 'tel:' + phone;
  },
  sms: function (phone, text) {
    if (!phone) { alert('请先绑定电话'); return; }
    location.href = 'sms:' + phone + '?body=' + encodeURIComponent(text || '');
  }
};
