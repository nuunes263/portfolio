const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string;
  link?: string;
  imagemUrl?: string;
  criadoEm?: string;
}

export type ProjetoInput = Omit<Projeto, 'id' | 'criadoEm'>;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function getProjetos(): Promise<Projeto[]> {
  const res = await fetch(`${API}/api/projetos`, { cache: 'no-store' });
  return handleResponse(res);
}

export async function login(password: string): Promise<{ token: string; ok: boolean }> {
  const res = await fetch(`${API}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Senha incorreta');
  return res.json();
}

export async function createProjeto(data: ProjetoInput, token: string): Promise<Projeto> {
  const res = await fetch(`${API}/api/projetos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProjeto(id: number, data: ProjetoInput, token: string): Promise<Projeto> {
  const res = await fetch(`${API}/api/projetos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteProjeto(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/api/projetos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}
