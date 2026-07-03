import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  GalleryHorizontalEnd,
  Link as LinkIcon,
  LogOut,
  Mail,
  QrCode,
  Send,
  Sparkles,
} from "lucide-react";
import { apiRequest, downloadQrCode } from "../api/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

function Dashboard() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [currentQr, setCurrentQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailingId, setEmailingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const user = useMemo(() => getStoredUser(), []);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const loadQrCodes = async () => {
    try {
      const data = await apiRequest("/qr/my-codes", {
        headers: authHeaders,
      });

      setQrCodes(data.qrCodes || []);

      if (!currentQr && data.qrCodes?.length > 0) {
        setCurrentQr(data.qrCodes[0]);
      }
    } catch {
      setError("Unable to load your QR gallery.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadQrCodes();
  }, [token, navigate]);

  const prepareUrl = (value) => {
    const trimmedUrl = value.trim();

    if (!trimmedUrl) return "";

    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const finalUrl = prepareUrl(url);

    if (!finalUrl) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/qr/generate", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ url: finalUrl }),
      });

      setCurrentQr(data.qrCode);
      setUrl("");
      setMessage("QR code created successfully.");
      await loadQrCodes();
    } catch {
      setError("QR code generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (qrId) => {
    setError("");
    setMessage("");

    try {
      await downloadQrCode(qrId, token);
      setMessage("QR code downloaded.");
    } catch {
      setError("QR code download failed.");
    }
  };

  const handleEmail = async (qrId) => {
    setError("");
    setMessage("");

    try {
      setEmailingId(qrId);

      await apiRequest(`/qr/${qrId}/email`, {
        method: "POST",
        headers: authHeaders,
      });

      setMessage("QR code sent to your email.");
    } catch {
      setError("QR code email failed.");
    } finally {
      setEmailingId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="studio-shell">
      <section className="studio-hero">
        <nav className="studio-nav">
          <div className="brand-mark">
            <QrCode size={28} />
            <span>QR Studio</span>
          </div>

          <button className="ghost-button" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <Sparkles size={16} />
              Private QR gallery
            </p>

            <h1>The Floating QR Generator</h1>

            <p className="hero-text">
              Create, collect, download, and email your QR codes from one calm
              visual workspace.
            </p>

            <div className="hero-meta">
              <span>Welcome, {user.name || "Creator"}</span>
              <span>{qrCodes.length} saved QR codes</span>
            </div>
          </div>

          <div className="floating-preview">
            <div className="preview-orbit preview-orbit-one" />
            <div className="preview-orbit preview-orbit-two" />

            <div className="preview-card">
              {currentQr?.qrImage ? (
                <img src={currentQr.qrImage} alt="Generated QR code" />
              ) : (
                <QrCode size={160} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="studio-workspace">
        <div className="generator-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Create</p>
              <h2>Generate a new QR code</h2>
            </div>

            <LinkIcon size={26} />
          </div>

          <form onSubmit={handleGenerate} className="qr-form">
            <label htmlFor="url">Website URL</label>

            <div className="input-row">
              <input
                id="url"
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="example.com"
              />

              <button type="submit" disabled={loading}>
                <Send size={18} />
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>

          {error && <p className="alert alert-error">{error}</p>}
          {message && <p className="alert alert-success">{message}</p>}

          {currentQr && (
            <div className="result-stage">
              <div className="result-qr">
                <img src={currentQr.qrImage} alt="Generated QR code" />
              </div>

              <div className="result-details">
                <p className="section-label">Latest QR</p>
                <h3>{currentQr.url}</h3>

                <div className="action-row">
                  <button onClick={() => handleDownload(currentQr._id)}>
                    <Download size={18} />
                    Download
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => handleEmail(currentQr._id)}
                    disabled={emailingId === currentQr._id}
                  >
                    <Mail size={18} />
                    {emailingId === currentQr._id ? "Sending..." : "Email me"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="gallery-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Collection</p>
              <h2>Recent QR Codes</h2>
            </div>

            <GalleryHorizontalEnd size={26} />
          </div>

          <div className="qr-gallery">
            {qrCodes.length === 0 ? (
              <p className="empty-state">Your QR gallery is empty.</p>
            ) : (
              qrCodes.map((qrCode) => (
                <button
                  key={qrCode._id}
                  className={`gallery-item ${
                    currentQr?._id === qrCode._id ? "active" : ""
                  }`}
                  onClick={() => setCurrentQr(qrCode)}
                >
                  <img src={qrCode.qrImage} alt={qrCode.url} />
                  <span>{qrCode.url}</span>
                </button>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Dashboard;