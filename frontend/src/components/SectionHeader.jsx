export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center my-4">
      <h2 className="fw-bold mb-2">{title}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      <div className="d-flex justify-content-center mt-3">
        <span
          style={{
            display: "inline-block",
            width: 80,
            height: 4,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 100%)",
          }}
        />
      </div>
    </div>
  );
}
