import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tiago Ursich — Software Engineer',
  description: 'Portfólio de Tiago Ursich, engenheiro de software especializado em Java e Spring Boot.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
