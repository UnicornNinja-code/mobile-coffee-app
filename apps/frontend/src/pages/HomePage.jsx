import { Link } from 'react-router-dom';

const features = [
  'Frontend React disiapkan ke arah Progressive Web App untuk operasional lapangan.',
  'Backend Node.js + Express siap untuk integrasi BWM-TOPSIS, Overpass API, dan Open-Meteo API.',
  'Struktur awal sudah memisahkan alur Supervisor dan Rider agar pengembangan fitur lebih rapi.',
];

const roles = [
  {
    title: 'Supervisor',
    path: '/supervisor',
    points: ['Kelola zona operasional', 'Input bobot BWM', 'Pantau rider dan evaluasi hasil'],
  },
  {
    title: 'Rider',
    path: '/rider',
    points: ['Lihat rekomendasi zona', 'Akses tampilan mobile-first', 'Catat log penjualan'],
  },
];

function HomePage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Setup awal proyek</p>
          <h1>Mantau Kopi</h1>
          <p className="hero-text">
            Fondasi aplikasi sistem pendukung keputusan lokasi penjualan kopi keliling
            berbasis React PWA di frontend dan Node.js API di backend.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/supervisor">
              Lihat Area Supervisor
            </Link>
            <Link className="button secondary" to="/rider">
              Lihat Area Rider
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <span className="badge">PWA Ready</span>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-grid">
        {roles.map((role) => (
          <article className="role-card" key={role.title}>
            <h2>{role.title}</h2>
            <ul>
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link className="text-link" to={role.path}>
              Buka halaman {role.title.toLowerCase()}
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default HomePage;
