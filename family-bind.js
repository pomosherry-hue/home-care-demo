window.FamilyBind = {
  path: 'families/demo',
  load: function (db, cb) {
    db.ref(this.path).on('value', function (s) {
      cb(s.val() || {
        elderName: '张爷爷',
        elderPhone: '',
        familyName: '女儿',
        familyPhone: '',
        caregiverName: '护理员',
        caregiverPhone: ''
      });
    });
  },
  save: function (db, data) {
    return db.ref(this.path).update(data);
  },
  tel: function (phone) {
    if (!phone) { alert('请先在「家庭」页填写电话'); return; }
    location.href = 'tel:' + phone;
  },
  sms: function (phone, text) {
    if (!phone) { alert('请先在「家庭」页填写电话'); return; }
    location.href = 'sms:' + phone + '?body=' + encodeURIComponent(text || '');
  }
};
