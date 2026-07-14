(function () {
  /* ── State ── */
  var token = localStorage.getItem('admin_token');
  var editingId = null;

  /* ── DOM refs ── */
  var loginScreen = document.getElementById('login-screen');
  var loginForm = document.getElementById('login-form');
  var loginPwd = document.getElementById('pwd');
  var loginError = document.getElementById('login-error');
  var loginBtn = document.getElementById('login-btn');

  var dashboard = document.getElementById('admin-dashboard');
  var logoutBtn = document.getElementById('logout-btn');

  var newProjectBtn = document.getElementById('new-project-btn');
  var formPanel = document.getElementById('form-panel');
  var formTitle = document.getElementById('form-title');
  var projectForm = document.getElementById('project-form');
  var fieldTitulo = document.getElementById('field-titulo');
  var fieldDescricao = document.getElementById('field-descricao');
  var fieldTecnologias = document.getElementById('field-tecnologias');
  var fieldLink = document.getElementById('field-link');
  var fieldImagemFile = document.getElementById('field-imagemFile');
  var fieldImagemUrl = document.getElementById('field-imagemUrl');
  var imagemPreview = document.getElementById('imagem-preview');
  var imagemPreviewImg = document.getElementById('imagem-preview-img');
  var formError = document.getElementById('form-error');
  var formSubmitBtn = document.getElementById('form-submit-btn');
  var formCancelBtn = document.getElementById('form-cancel-btn');

  var listContainer = document.getElementById('project-list-container');
  var listStatus = document.getElementById('list-status');
  var projectList = document.getElementById('project-list');
  var listEmpty = document.getElementById('list-empty');
  var statusMsg = document.getElementById('status-msg');

  /* ── File preview ── */
  fieldImagemFile.addEventListener('change', function () {
    var file = this.files[0];
    if (!file) {
      hide(imagemPreview);
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      imagemPreviewImg.src = e.target.result;
      show(imagemPreview);
    };
    reader.readAsDataURL(file);
  });

  /* ── Helpers ── */
  function show(el) { el.style.display = ''; }
  function hide(el) { el.style.display = 'none'; }

  function flash(msg) {
    statusMsg.textContent = msg;
    show(statusMsg);
    setTimeout(function () { hide(statusMsg); }, 2500);
  }

  function formatTech(tecnologias) {
    return tecnologias
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean)
      .join(' \u00B7 ');
  }

  /* ── API ── */
  function api(path, options) {
    return fetch('/api' + path, options).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (res.status === 204) return undefined;
      return res.json();
    });
  }

  function authHeaders() {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  }

  /* ── Render project list ── */
  function renderProjects(projetos) {
    hide(listStatus);
    hide(listEmpty);
    hide(projectList);

    if (projetos.length === 0) {
      show(listEmpty);
      return;
    }

    projectList.innerHTML = '';
    projetos.forEach(function (p) {
      var item = document.createElement('div');
      item.className = 'project-list-item';

      var info = document.createElement('div');
      info.className = 'project-list-item__info';

      var name = document.createElement('p');
      name.className = 'project-list-item__name';
      name.textContent = p.titulo;
      info.appendChild(name);

      if (p.tecnologias) {
        var tech = document.createElement('p');
        tech.className = 'project-list-item__tech';
        tech.textContent = formatTech(p.tecnologias);
        info.appendChild(tech);
      }

      var actions = document.createElement('div');
      actions.className = 'project-list-item__actions';

      var editBtn = document.createElement('button');
      editBtn.className = 'btn btn-secondary btn-sm';
      editBtn.textContent = 'Editar';
      editBtn.addEventListener('click', function () { openEdit(p); });
      actions.appendChild(editBtn);

      var delBtn = document.createElement('button');
      delBtn.className = 'btn btn-danger btn-sm';
      delBtn.textContent = 'Excluir';
      delBtn.addEventListener('click', function () { handleDelete(p); });
      actions.appendChild(delBtn);

      item.appendChild(info);
      item.appendChild(actions);
      projectList.appendChild(item);
    });

    show(projectList);
  }

  function loadProjects() {
    show(listStatus);
    listStatus.textContent = 'Carregando…';
    api('/projetos')
      .then(function (projetos) {
        renderProjects(projetos);
      })
      .catch(function () {
        listStatus.textContent = 'Erro ao carregar projetos.';
      });
  }

  /* ── Login ── */
  function checkAuth() {
    if (token) {
      hide(loginScreen);
      show(dashboard);
      loadProjects();
    } else {
      show(loginScreen);
      hide(dashboard);
    }
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hide(loginError);
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando…';

    var password = loginPwd.value;
    api('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    })
    .then(function (result) {
      localStorage.setItem('admin_token', result.token);
      token = result.token;
      checkAuth();
    })
    .catch(function () {
      loginError.textContent = 'Senha incorreta. Tente novamente.';
      show(loginError);
    })
    .finally(function () {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar';
    });
  });

  /* ── Logout ── */
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('admin_token');
    token = null;
    editingId = null;
    checkAuth();
  });

  /* ── Form ── */
  function resetForm() {
    editingId = null;
    fieldTitulo.value = '';
    fieldDescricao.value = '';
    fieldTecnologias.value = '';
    fieldLink.value = '';
    fieldImagemFile.value = '';
    fieldImagemUrl.value = '';
    hide(imagemPreview);
    imagemPreviewImg.src = '';
    hide(formError);
  }

  function openNew() {
    resetForm();
    formTitle.textContent = 'Novo Projeto';
    formSubmitBtn.textContent = 'Criar projeto';
    show(formPanel);
    fieldTitulo.focus();
  }

  function openEdit(p) {
    editingId = p.id;
    fieldTitulo.value = p.titulo;
    fieldDescricao.value = p.descricao || '';
    fieldTecnologias.value = p.tecnologias || '';
    fieldLink.value = p.link || '';
    fieldImagemFile.value = '';
    fieldImagemUrl.value = p.imagemUrl || '';
    if (p.imagemUrl) {
      imagemPreviewImg.src = p.imagemUrl;
      show(imagemPreview);
    } else {
      hide(imagemPreview);
      imagemPreviewImg.src = '';
    }
    formTitle.textContent = 'Editar Projeto';
    formSubmitBtn.textContent = 'Salvar altera\u00E7\u00F5es';
    hide(formError);
    show(formPanel);
    fieldTitulo.focus();
  }

  function closeForm() {
    hide(formPanel);
    resetForm();
  }

  newProjectBtn.addEventListener('click', openNew);
  formCancelBtn.addEventListener('click', closeForm);

  function uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file);
    return fetch('/api/projetos/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    }).then(function (res) {
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    }).then(function (data) {
      return data.imagemUrl;
    });
  }

  function handleSave() {
    hide(formError);

    var file = fieldImagemFile.files[0];
    var imagemUrl = fieldImagemUrl.value;

    function doSave(url) {
      var data = {
        titulo: fieldTitulo.value.trim(),
        descricao: fieldDescricao.value.trim(),
        tecnologias: fieldTecnologias.value.trim(),
        link: fieldLink.value.trim(),
        imagemUrl: url
      };

      var path;
      var method;
      if (editingId !== null) {
        path = '/projetos/' + editingId;
        method = 'PUT';
      } else {
        path = '/projetos';
        method = 'POST';
      }

      return api(path, {
        method: method,
        headers: authHeaders(),
        body: JSON.stringify(data)
      });
    }

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = 'Salvando…';

    var promise;
    if (file) {
      promise = uploadFile(file).then(function (url) {
        return doSave(url);
      });
    } else {
      promise = doSave(imagemUrl);
    }

    promise
      .then(function () {
        flash(editingId !== null ? 'Projeto atualizado.' : 'Projeto criado.');
        closeForm();
        loadProjects();
      })
      .catch(function () {
        formError.textContent = 'Erro ao salvar. Verifique os dados e tente novamente.';
        show(formError);
      })
      .finally(function () {
        formSubmitBtn.disabled = false;
        formSubmitBtn.textContent = editingId !== null ? 'Salvar altera\u00E7\u00F5es' : 'Criar projeto';
      });
  }

  projectForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!fieldTitulo.value.trim()) {
      formError.textContent = 'O t\u00EDtulo \u00E9 obrigat\u00F3rio.';
      show(formError);
      return;
    }
    handleSave();
  });

  /* ── Delete ── */
  function handleDelete(p) {
    if (!window.confirm('Excluir "' + p.titulo + '"?')) return;
    api('/projetos/' + p.id, {
      method: 'DELETE',
      headers: authHeaders()
    })
    .then(function () {
      loadProjects();
      flash('Projeto exclu\u00EDdo.');
    })
    .catch(function () {
      alert('Erro ao excluir o projeto.');
    });
  }

  /* ── Init ── */
  checkAuth();
})();
