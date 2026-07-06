import { Link } from "react-router-dom";
import { ArrowRight, Download, Mail, QrCode, ShieldCheck, Sparkles } from "lucide-react";

function Home() {
  return (
    <main className="home-shell">
      <nav className="home-nav">
        <Link to="/" className="brand-mark">
          <QrCode size={28} />
          <span>QR Studio</span>
        </Link>

        <div className="home-nav-actions">
          <Link to="/login" className="nav-link">
            Login
          </Link>

          <Link to="/register" className="nav-button">
            Create account
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <div className="home-copy">
          <p className="eyebrow">
            <Sparkles size={16} />
            Secure QR code workspace
          </p>

          <h1>Create polished QR codes in seconds.</h1>

          <p className="hero-text">
            Register, verify your email, generate QR codes for URLs, download
            them, and send them to yourself from one clean dashboard.
          </p>

          <div className="home-actions">
            <Link to="/register" className="primary-link">
              Start creating
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="secondary-link">
              Login
            </Link>
          </div>

          <div className="home-feature-row">
            <span>
              <ShieldCheck size={18} />
              Verified accounts
            </span>

            <span>
              <Download size={18} />
              PNG downloads
            </span>

            <span>
              <Mail size={18} />
              Email delivery
            </span>
          </div>
        </div>

        <div className="home-visual">
          <div className="home-orbit home-orbit-one" />
          <div className="home-orbit home-orbit-two" />

          <div className="sample-qr-card">
            <div className="sample-qr-grid">
              {Array.from({ length: 49 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    [0, 1, 2, 7, 14, 16, 18, 22, 24, 28, 30, 34, 36, 42, 43, 44].includes(index)
                      ? "dark-cell"
                      : ""
                  }
                />
              ))}
            </div>

            <p>https://your-link.com</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;