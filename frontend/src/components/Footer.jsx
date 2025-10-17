export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-center py-3 mt-auto border-top"
      style={{
        backgroundColor: "#1e1e1e",
        color: "#aaa",
        fontSize: "0.9rem",
      }}
    >
      <p style={{ margin: 0 }}>
        © {year} — Created by{" "}
        <span style={{ color: "#9b86f7", fontWeight: "600" }}>
          Alicele Ravanello Barbieri
        </span>{" "}
        ☕💻
      </p>
    </footer>
  );
}
