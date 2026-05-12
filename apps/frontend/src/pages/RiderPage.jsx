import { Link } from 'react-router-dom';

const recommendations = [
  { zone: 'Zona Kampus ITS', score: '0.887', level: 'Sangat direkomendasikan' },
  { zone: 'Zona SIER Rungkut', score: '0.560', level: 'Direkomendasikan' },
  { zone: 'Zona HR Muhammad', score: '0.522', level: 'Direkomendasikan' },
];

function RiderPage() {
  return (
    <main className="shell shell-mobile">
      <div className="page-header mobile">
        <div>
          <p className="eyebrow">Preview peran</p>
          <h1>Mode Rider</h1>
          <p className="page-text">
            Tampilan ini diarahkan ke PWA agar lebih fleksibel saat digunakan dalam operasional lapangan.
          </p>
        </div>
        <Link className="text-link" to="/">
          Kembali
        </Link>
      </div>

      <section className="mobile-frame">
        <div className="mobile-topbar">
          <strong>Rekomendasi Zona</strong>
          <span className="badge">Online</span>
        </div>
        <div className="mobile-map">
          <div className="mobile-zone zone-a">A</div>
          <div className="mobile-zone zone-b">B</div>
          <div className="mobile-zone zone-c">C</div>
          <div className="rider-pin" />
        </div>
        <div className="mobile-sheet">
          <h2>Top Rekomendasi</h2>
          {recommendations.map((item) => (
            <article className="recommendation-card" key={item.zone}>
              <div>
                <strong>{item.zone}</strong>
                <p>Skor TOPSIS {item.score}</p>
              </div>
              <span>{item.level}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default RiderPage;
