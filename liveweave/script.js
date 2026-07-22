(function () {
  'use strict';

  var categories = [
    'もっと稼ぎたい',
    '指名やリピーターを増やしたい',
    '写メ日記やプロフィールを相談したい',
    '出勤日数や勤務時間を相談したい',
    '苦手なお客様、NG顧客について相談したい',
    '接客やお客様対応で困っている',
    'スタッフや店舗への要望がある',
    '待遇や精算について確認したい',
    'モチベーションや仕事との両立を相談したい',
    '退店、休職、復帰について相談したい',
    '特に決まっていないが話したい',
    'その他'
  ];

  var specialRequests = [
    '最初は聞くだけにしてほしい',
    '女性スタッフを希望',
    'できるだけ短時間がよい',
    '人目につきにくい場所を希望',
    '急ぎで相談したい',
    'その他の配慮が必要'
  ];

  var faqs = [
    [
      '売上が悪い人が呼ばれるものですか？',
      'いいえ。売上だけを理由に責めるための時間ではありません。働き方や困りごとを一緒に整理するための時間です。'
    ],
    ['特に相談がなくても予約できますか？', 'はい。近況を少し話したいという内容でも大丈夫です。'],
    ['相談時間はどれくらいですか？', '通常は5〜15分程度です。'],
    ['強制ですか？', '原則として強制ではありません。'],
    ['どんな方法で相談できますか？', '対面、電話、LINE、オンラインなど、店舗で利用可能な方法から選べます。'],
    [
      '内容は誰まで共有されますか？',
      '原則として対応に必要なスタッフのみで取り扱います。緊急対応が必要な場合は、必要な範囲で責任者へ共有することがあります。'
    ],
    ['予約後に変更できますか？', 'ブラウザ上の予約詳細から日時、内容の変更、キャンセルができます。']
  ];

  var booking = {
    date: '',
    time: '',
    method: '',
    staff: 'おまかせ',
    categories: [],
    note: '',
    requests: [],
    reservationNumber: ''
  };

  var $ = function (selector) {
    return document.querySelector(selector);
  };

  var $$ = function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  };

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  }

  function setTodayAsMinimumDate() {
    var dateInput = $('#date-input');
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var value = yyyy + '-' + mm + '-' + dd;
    dateInput.min = value;
    dateInput.value = value;
    booking.date = value;
  }

  function renderLandingCategories() {
    var list = $('#category-card-list');
    categories.forEach(function (category) {
      list.appendChild(createElement('article', 'category-card', category));
    });
  }

  function renderCheckboxes(containerSelector, items, name) {
    var container = $(containerSelector);
    items.forEach(function (item) {
      var label = createElement('label', 'checkbox-option');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = name;
      input.value = item;
      label.appendChild(input);
      label.appendChild(document.createTextNode(item));
      container.appendChild(label);
    });
  }

  function renderFaq() {
    var list = $('#faq-list');
    faqs.forEach(function (faq, index) {
      var item = createElement('article', 'faq-item');
      var button = createElement('button', 'faq-question');
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'faq-answer-' + index);
      button.innerHTML = '<strong>Q. ' + faq[0] + '</strong><span aria-hidden="true">＋</span>';
      var answer = createElement('div', 'faq-answer');
      answer.id = 'faq-answer-' + index;
      answer.textContent = 'A. ' + faq[1];
      button.addEventListener('click', function () {
        var isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
        button.querySelector('span').textContent = isOpen ? '−' : '＋';
      });
      item.appendChild(button);
      item.appendChild(answer);
      list.appendChild(item);
    });
  }

  function showView(name) {
    $$('.view').forEach(function (view) {
      view.classList.remove('is-active');
    });
    $('#' + name + '-view').classList.add('is-active');
    var mobileCta = $('[data-mobile-cta]');
    mobileCta.classList.toggle('is-hidden', name !== 'lp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showStep(step) {
    $$('.flow-step').forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-step') === String(step));
    });
    $$('[data-step-indicator]').forEach(function (item) {
      item.classList.toggle('is-active', item.getAttribute('data-step-indicator') === String(step));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function readStepOne() {
    booking.date = $('#date-input').value;
    booking.time = $('#time-input').value;
    booking.method = $('#method-input').value;
    booking.staff = $('#staff-input').value;
  }

  function readStepTwo() {
    booking.categories = $$('input[name="category"]:checked').map(function (input) {
      return input.value;
    });
    booking.requests = $$('input[name="request"]:checked').map(function (input) {
      return input.value;
    });
    booking.note = $('#note-input').value.trim();
  }

  function validateStepOne() {
    readStepOne();
    var error = $('#step-one-error');
    if (!booking.date || !booking.time || !booking.method) {
      error.textContent = '希望日、希望時間、相談方法を選択してください。';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function validateStepTwo() {
    readStepTwo();
    var error = $('#step-two-error');
    if (!booking.categories.length) {
      error.textContent = '相談カテゴリを1つ以上選択してください。';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function formatDateTime() {
    if (!booking.date || !booking.time) {
      return '未選択';
    }
    return booking.date.replace(/-/g, '/') + ' ' + booking.time + '〜（約15分）';
  }

  function renderDefinitionList(selector) {
    var list = $(selector);
    var rows = [
      ['キャスト名', '山田 はるか'],
      ['店舗', 'ミント新宿店'],
      ['予約日時', formatDateTime()],
      ['相談方法', booking.method],
      ['担当者', booking.staff],
      ['相談カテゴリ', booking.categories.join('、')],
      ['事前相談内容', booking.note || '未入力'],
      ['配慮希望', booking.requests.length ? booking.requests.join('、') : 'なし'],
      ['予約番号', booking.reservationNumber || '確定後に発行']
    ];
    list.innerHTML = '';
    rows.forEach(function (row) {
      var wrapper = document.createElement('div');
      var dt = createElement('dt', '', row[0]);
      var dd = createElement('dd', '', row[1]);
      wrapper.appendChild(dt);
      wrapper.appendChild(dd);
      list.appendChild(wrapper);
    });
  }

  function renderReservationCard() {
    var card = $('#reservation-card');
    if (!booking.reservationNumber) {
      card.className = 'card-section empty-state';
      card.innerHTML = '<p>現在、予約中の相談タイムはありません。</p><button class="button primary" data-view-button="reserve">相談タイムを予約する</button>';
      bindViewButtons(card);
      return;
    }
    card.className = 'card-section';
    card.innerHTML =
      '<h2>予約済み</h2>' +
      '<p><strong>' + formatDateTime() + '</strong></p>' +
      '<p>相談方法：' + booking.method + ' / 担当者：' + booking.staff + '</p>' +
      '<p>相談カテゴリ：' + booking.categories.join('、') + '</p>' +
      '<p>ステータス：予約済み</p>' +
      '<p>予約番号：' + booking.reservationNumber + '</p>' +
      '<button class="button secondary" data-view-button="reserve">デモでもう一度予約する</button>';
    bindViewButtons(card);
  }

  function completeBooking() {
    $('#complete-button').disabled = true;
    $('#complete-button').textContent = '処理中...';
    window.setTimeout(function () {
      booking.reservationNumber = 'LW-' + String(Date.now()).slice(-6);
      renderDefinitionList('#complete-list');
      renderReservationCard();
      showStep(4);
      $('#complete-button').disabled = false;
      $('#complete-button').textContent = '予約を確定する';
    }, 450);
  }

  function bindViewButtons(scope) {
    var root = scope || document;
    Array.prototype.slice.call(root.querySelectorAll('[data-view-button]')).forEach(function (button) {
      button.addEventListener('click', function () {
        var view = button.getAttribute('data-view-button');
        if (view === 'reserve') {
          showView('reserve');
          showStep(1);
        } else if (view === 'list') {
          renderReservationCard();
          showView('list');
        } else {
          showView(view);
        }
      });
    });
  }

  function bindStepButtons() {
    $$('[data-next-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        var next = button.getAttribute('data-next-step');
        if (next === '2' && !validateStepOne()) {
          return;
        }
        if (next === '3') {
          if (!validateStepTwo()) {
            return;
          }
          renderDefinitionList('#confirm-list');
        }
        showStep(next);
      });
    });

    $$('[data-prev-step]').forEach(function (button) {
      button.addEventListener('click', function () {
        showStep(button.getAttribute('data-prev-step'));
      });
    });

    $('#complete-button').addEventListener('click', completeBooking);
  }

  function bindInputs() {
    $('#note-input').addEventListener('input', function (event) {
      $('#note-count').textContent = String(event.target.value.length);
    });
  }

  function init() {
    renderLandingCategories();
    renderCheckboxes('#category-checkbox-list', categories, 'category');
    renderCheckboxes('#request-checkbox-list', specialRequests, 'request');
    renderFaq();
    setTodayAsMinimumDate();
    bindViewButtons(document);
    bindStepButtons();
    bindInputs();
  }

  init();
})();
