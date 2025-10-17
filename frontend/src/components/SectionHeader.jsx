import "./SectionHeader.css";

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <h2 className="cascade cascade-1">{title}</h2>
      {subtitle && <p className="cascade cascade-2">{subtitle}</p>}
      <div className="divider cascade cascade-3" />
    </div>
  );
}
