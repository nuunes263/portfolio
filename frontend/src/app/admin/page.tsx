'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { getProjetos, login as loginApi, createProjeto, updateProjeto, deleteProjeto, type Projeto, type ProjetoInput } from '@/lib/api';

const EMPTY_FORM: ProjetoInput = {
  titulo: '',
  descricao: '',
  tecnologias: '',
  link: '',
  imagemUrl: '',
};

function formatTech(tecnologias: string) {
  return tecnologias
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .join(' · ');
}

export default function AdminPage() {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Login
  const [loginPwd, setLoginPwd] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Projects
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Form
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjetoInput>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Feedback
  const [statusMsg, setStatusMsg] = useState('');

  /* ── Hydration / restore session ── */
  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored) setToken(stored);
    setHydrated(true);
  }, []);

  /* ── Load projects ── */
  const loadProjetos = useCallback(async () => {
    setLoadingList(true);
    try {
      setProjetos(await getProjetos());
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadProjetos();
  }, [token, loadProjetos]);

  /* ── Auth ── */
  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const result = await loginApi(loginPwd);
      localStorage.setItem('admin_token', result.token);
      setToken(result.token);
    } catch {
      setLoginError('Senha incorreta. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setToken(null);
    setProjetos([]);
  }

  /* ── Form helpers ── */
  function openNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(p: Projeto) {
    setForm({
      titulo: p.titulo,
      descricao: p.descricao ?? '',
      tecnologias: p.tecnologias ?? '',
      link: p.link ?? '',
      imagemUrl: p.imagemUrl ?? '',
    });
    setEditingId(p.id);
    setFormError('');
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function field(key: keyof ProjetoInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) {
      setFormError('O título é obrigatório.');
      return;
    }
    setFormError('');
    setFormLoading(true);
    try {
      if (editingId !== null) {
        await updateProjeto(editingId, form, token!);
        flash('Projeto atualizado.');
      } else {
        await createProjeto(form, token!);
        flash('Projeto criado.');
      }
      closeForm();
      await loadProjetos();
    } catch {
      setFormError('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: number, titulo: string) {
    if (!window.confirm(`Excluir "${titulo}"?`)) return;
    try {
      await deleteProjeto(id, token!);
      await loadProjetos();
      flash('Projeto excluído.');
    } catch {
      alert('Erro ao excluir o projeto.');
    }
  }

  function flash(msg: string) {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 2500);
  }

  /* ── Render ── */
  if (!hydrated) return null;

  if (!token) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1 className="login-card__title">Admin</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="pwd">
                Senha
              </label>
              <input
                id="pwd"
                type="password"
                className="form-input"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                autoFocus
                autoComplete="current-password"
              />
              {loginError && <p className="form-error">{loginError}</p>}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loginLoading}
            >
              {loginLoading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="admin-header">
        <div className="container">
          <div className="admin-header__inner">
            <span className="admin-header__title">Admin</span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="admin-body">
        <div className="container">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Projetos</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {statusMsg && <span className="admin-status">{statusMsg}</span>}
              {!formOpen && (
                <button className="btn btn-primary btn-sm" onClick={openNew}>
                  + Novo Projeto
                </button>
              )}
            </div>
          </div>

          {/* ── Form panel ── */}
          {formOpen && (
            <div className="form-panel">
              <p className="form-panel__title">
                {editingId !== null ? 'Editar Projeto' : 'Novo Projeto'}
              </p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.titulo}
                    onChange={(e) => field('titulo', e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea
                    className="form-textarea"
                    value={form.descricao}
                    onChange={(e) => field('descricao', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tecnologias</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.tecnologias}
                    onChange={(e) => field('tecnologias', e.target.value)}
                    placeholder="Java, Spring Boot, PostgreSQL"
                  />
                  <p className="form-hint">Separe com vírgulas.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Link</label>
                  <input
                    type="url"
                    className="form-input"
                    value={form.link}
                    onChange={(e) => field('link', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">URL da Imagem</label>
                  <input
                    type="url"
                    className="form-input"
                    value={form.imagemUrl}
                    onChange={(e) => field('imagemUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                {formError && (
                  <p className="form-error" style={{ marginBottom: 12 }}>
                    {formError}
                  </p>
                )}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading
                      ? 'Salvando…'
                      : editingId !== null
                      ? 'Salvar alterações'
                      : 'Criar projeto'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeForm}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Project list ── */}
          {loadingList ? (
            <p style={{ fontSize: 15, color: 'var(--text-tertiary)' }}>Carregando…</p>
          ) : projetos.length === 0 ? (
            <div className="list-empty">Nenhum projeto cadastrado.</div>
          ) : (
            <div className="project-list">
              {projetos.map((p) => (
                <div key={p.id} className="project-list-item">
                  <div className="project-list-item__info">
                    <p className="project-list-item__name">{p.titulo}</p>
                    {p.tecnologias && (
                      <p className="project-list-item__tech">{formatTech(p.tecnologias)}</p>
                    )}
                  </div>
                  <div className="project-list-item__actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id, p.titulo)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
