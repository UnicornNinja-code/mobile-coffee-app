import { Link } from 'react-router-dom';

const metrics = [
  ['Zona Aktif', '12'],
  ['Rider Aktif', '6'],
  ['POI Tersinkron', '284'],
  ['Log Hari Ini', '27'],
];

function SupervisorPage() {
  return (
    <main className="shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Preview peran</p>
          <h1>Dashboard Supervisor</h1>
          <p className="page-text">
            Halaman awal untuk memantau operasional, mengelola zona, dan mengatur parameter SPK.
          </p>
        </div>
        <Link className="text-link" to="/">
          Kembali ke beranda
        </Link>
      </div>

      <section className="metric-grid">
        {metrics.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel map-panel">
          <div className="panel-head">
            <h2>Peta Operasional</h2>
            <span>Leaflet placeholder</span>
          </div>
          <div className="map-placeholder">
            <div className="zone zone-a">Zona Kampus ITS</div>
            <div className="zone zone-b">Zona SIER</div>
            <div className="zone zone-c">Zona HR Muhammad</div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Menu Prioritas</h2>
            <span>Langkah berikutnya</span>
          </div>
          <ul className="stack-list">
            <li>Kelola zona operasional dan polygon peta</li>
            <li>Sinkronisasi POI dari Overpass API</li>
            <li>Input BWM, matriks keramaian, dan sensitivitas cuaca</li>
            <li>Monitoring rider dan evaluasi hasil rekomendasi</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default SupervisorPage;
