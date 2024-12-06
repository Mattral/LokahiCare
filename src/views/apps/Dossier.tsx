import React, { useState } from "react";
import { useRouter } from "next/router";
const DossierPage: React.FC = () => {
  const [topCards, setTopCards] = useState<number[]>([]);
  const [bottomCards, setBottomCards] = useState<number[]>([]);

  const addTopCard = () => {
    setTopCards([...topCards, topCards.length + 1]);
  };

  const addBottomCard = () => {
    setBottomCards([...bottomCards, bottomCards.length + 1]);
  };

  return (
    <div style={styles.container}>
      {/* Top Section */}
      <div style={styles.section}>
        <div style={styles.header}>
          <span style={styles.titleText}>Verify your Civil Identity</span>
          <button style={styles.button} onClick={addTopCard}>
            Open a Dossier
          </button>
        </div>
        <div style={styles.cardContainer}>
          {topCards.map((_, index) => (
            <DossierCard key={index} title={`Dossier${index + 1}`} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Bottom Section */}
      <div style={styles.section}>
        <div style={styles.header}>
          <span style={styles.titleText}>Verify your Professional Identity</span>
          <button style={styles.button} onClick={addBottomCard}>
            Open a Dossier
          </button>
        </div>
        <div style={styles.cardContainer}>
          {bottomCards.map((_, index) => (
            <DossierCard key={index} title={`Dossier${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DossierCard = ({ title }: { title: string }) => {
  return (
    <div className="dossier-card">
      {/* Nebula Background with floating particles */}
      <div className="card-background">
        <div className="particle-field">
          {[...Array(50)].map((_, index) => (
            <div key={index} className="particle" />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/nebula-background.png')] bg-cover opacity-70" />
      </div>

      {/* Card Content */}
      <div className="card-content">
        {/* Majestic Title */}
        <h3 className="title majestic-text">{title}</h3>

        {/* Majestic Buttons */}
        <div className="button-group">
          <button className="majestic-button edit-btn">Edit</button>
          <button className="majestic-button configure-btn">Configure</button>
        </div>
      </div>

      {/* Custom Styling */}
      <style jsx>{`
        .dossier-card {
          width: 300px;
          height: 200px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          overflow: hidden;
          margin-right: 20px;
          cursor: pointer;
          transition: transform 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .dossier-card:hover {
          transform: scale(1.05);
        }
        .card-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #4c1d95, #000000);
          opacity: 0.9;
          overflow: hidden;
          z-index: 0;
        }
        .particle-field {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8);
          animation: floating 5s infinite ease-in-out, twinkle 3s infinite alternate;
          opacity: 0.7;
          width: 6px;
          height: 6px;
        }
        .particle:nth-child(odd) { animation-duration: 4s; }
        .particle:nth-child(even) { animation-duration: 6s; }

        .card-content {
          position: relative;
          z-index: 1;
          color: white;
          text-align: center;
        }

        /* Title with majestic glow */
        .title {
          font-size: 1.75rem;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 204, 0, 0.8), 0 0 20px rgba(255, 204, 0, 1);
          background: linear-gradient(90deg, #ff7e5f, #feb47b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Majestic Buttons */
        .button-group {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        .majestic-button {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
          cursor: pointer;
        }
        .majestic-button:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 25px rgba(255, 255, 255, 0.5);
        }
        .edit-btn:hover { color: #4a90e2; }
        .configure-btn:hover { color: #a64dff; }

        /* Animations for particles */
        @keyframes floating {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};


export default DossierPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f8f9fa",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    padding: "20px 40px",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "12px",
    margin: "20px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  titleText: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#343a40",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  cardContainer: {
    display: "flex",
    overflowX: "auto",
    width: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    gap: "16px",
    scrollBehavior: "smooth",
  },
  divider: {
    width: "90%",
    margin: "auto",
    borderTop: "1px solid #dee2e6",
  },
};
