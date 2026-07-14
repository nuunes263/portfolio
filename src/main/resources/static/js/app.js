(function () {
  var DESCRIPTION_MAX_LENGTH = 120;

  var container = document.getElementById('projects-container');
  var grid = document.getElementById('projects-grid');
  var statusEl = document.getElementById('projects-status');

  function formatTech(tecnologias) {
    return tecnologias
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean)
      .join(' \u00B7 ');
  }

  function createCard(projeto) {
    var article = document.createElement('article');
    article.className = 'project-card';

    if (projeto.imagemUrl) {
      var img = document.createElement('img');
      img.src = projeto.imagemUrl;
      img.alt = projeto.titulo;
      img.className = 'project-card__image';
      article.appendChild(img);
    }

    var body = document.createElement('div');
    body.className = 'project-card__body';

    var title = document.createElement('h2');
    title.className = 'project-card__title';
    title.textContent = projeto.titulo;
    body.appendChild(title);

    if (projeto.descricao) {
      var descWrapper = document.createElement('div');
      descWrapper.className = 'project-card__desc-wrapper';

      var desc = document.createElement('p');
      desc.className = 'project-card__desc';

      if (projeto.descricao.length > DESCRIPTION_MAX_LENGTH) {
        desc.textContent = projeto.descricao.substring(0, DESCRIPTION_MAX_LENGTH) + '\u2026';
        desc.classList.add('project-card__desc-truncated');
        descWrapper.appendChild(desc);

        var verMais = document.createElement('button');
        verMais.className = 'project-card__ver-mais';
        verMais.textContent = 'Ver mais';
        verMais.addEventListener('click', function () {
          if (desc.classList.contains('project-card__desc-truncated')) {
            desc.textContent = projeto.descricao;
            desc.classList.remove('project-card__desc-truncated');
            verMais.textContent = 'Ver menos';
          } else {
            desc.textContent = projeto.descricao.substring(0, DESCRIPTION_MAX_LENGTH) + '\u2026';
            desc.classList.add('project-card__desc-truncated');
            verMais.textContent = 'Ver mais';
          }
        });
        descWrapper.appendChild(verMais);
      } else {
        desc.textContent = projeto.descricao;
        descWrapper.appendChild(desc);
      }

      body.appendChild(descWrapper);
    }

    if (projeto.tecnologias) {
      var tech = document.createElement('p');
      tech.className = 'project-card__tech';
      tech.textContent = formatTech(projeto.tecnologias);
      body.appendChild(tech);
    }

    if (projeto.link) {
      var link = document.createElement('a');
      link.href = projeto.link;
      link.className = 'project-card__link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Ver projeto \u2192';
      body.appendChild(link);
    }

    article.appendChild(body);
    return article;
  }

  fetch('/api/projetos', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (projetos) {
      container.removeChild(statusEl);
      if (projetos.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'projects-empty';
        empty.textContent = 'Nenhum projeto cadastrado ainda.';
        container.appendChild(empty);
      } else {
        projetos.forEach(function (p) {
          grid.appendChild(createCard(p));
        });
      }
    })
    .catch(function () {
      statusEl.textContent = 'N\u00E3o foi poss\u00EDvel carregar os projetos.';
    });

  // Fallback if photo fails to load
  document.getElementById('profilePhoto').addEventListener('error', function () {
    var wrap = this.parentNode;
    var placeholder = document.createElement('div');
    placeholder.className = 'hero__photo-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'TU';
    wrap.replaceChild(placeholder, this);
  });
})();
