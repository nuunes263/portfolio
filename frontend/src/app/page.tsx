'use client';

import { useEffect, useState } from 'react';
import { getProjetos, type Projeto } from '@/lib/api';

// Coloque sua foto em frontend/public/foto.jpg
const PHOTO_SRC = '/foto_perfil.jpeg';

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function formatTech(tecnologias: string) {
  return tecnologias
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .join(' · ');
}

export default function Home() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    getProjetos()
      .then(setProjetos)
      .catch(() => setError('Não foi possível carregar os projetos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <h1 className="hero__name">Tiago Ursich</h1>
              <p className="hero__role">Software Engineer</p>
              <nav className="hero__social" aria-label="Redes sociais">
                <a
                  href="https://linkedin.com/in/tiago-ursich"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://github.com/nuunes263"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href="https://instagram.com/nuursich"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </nav>
              <p className="hero__bio">
                Junior Software Developer @Sensedia&nbsp;&nbsp;·&nbsp;&nbsp;API Rest&nbsp;&nbsp;·&nbsp;&nbsp;Java&nbsp;&nbsp;·&nbsp;&nbsp;Spring Boot&nbsp;&nbsp;·&nbsp;&nbsp;SQL&nbsp;&nbsp;·&nbsp;&nbsp;AWS
              </p>
            </div>

            <div className="hero__photo-wrap">
              {!photoError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={PHOTO_SRC}
                  alt="Tiago Ursich"
                  className="hero__photo"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="hero__photo-placeholder" aria-hidden="true">TU</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Projetos ── */}
      <section className="section">
        <div className="container">
          <p className="section__label">Projetos</p>
          {loading && <p className="projects-empty">Carregando…</p>}
          {!loading && error && <p className="projects-empty">{error}</p>}
          {!loading && !error && projetos.length === 0 && (
            <p className="projects-empty">Nenhum projeto cadastrado ainda.</p>
          )}
          {!loading && !error && projetos.length > 0 && (
            <div className="projects-grid">
              {projetos.map((projeto) => (
                <article key={projeto.id} className="project-card">
                  {projeto.imagemUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={projeto.imagemUrl}
                      alt={projeto.titulo}
                      className="project-card__image"
                    />
                  )}
                  <div className="project-card__body">
                    <h2 className="project-card__title">{projeto.titulo}</h2>
                    {projeto.descricao && (
                      <p className="project-card__desc">{projeto.descricao}</p>
                    )}
                    {projeto.tecnologias && (
                      <p className="project-card__tech">{formatTech(projeto.tecnologias)}</p>
                    )}
                    {projeto.link && (
                      <a
                        href={projeto.link}
                        className="project-card__link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver projeto →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Tiago Ursich</p>
        </div>
      </footer>
    </>
  );
}
