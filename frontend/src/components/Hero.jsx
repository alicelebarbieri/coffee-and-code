import codecoffee from "../assets/codecoffee.png";

export default function Hero() {
  return (
    <div className="container my-4">
      <div className="hero-card position-relative p-4 p-md-5 rounded-4 border overflow-hidden">
        {}
        <img
          src={codecoffee}
          alt="Coffee & Code"
          className="hero-art d-none d-md-block"
        />

        {}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-6 mb-2 text-white">Coffee & Code ☕💻</h1>
          <p className="lead mb-0 text-white-50">
            Join the community. Learn, share, and ship together!
          </p>
        </div>
      </div>
    </div>
  );
}
