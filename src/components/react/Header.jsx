import { useState, useEffect } from "react";

export default function Header() {
  // Determine current page from URL
  const [currentPath, setCurrentPath] = useState("");
  
  useEffect(() => {
    // This will run on the client side after mount
    setCurrentPath(window.location.pathname);
    
    // Optional: Listen for navigation changes
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);
  
  const isHomePage = currentPath === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Always show Home button except on home page */}
        {!isHomePage && (
          <a href="/" className="nav-link">
            Home
          </a>
        )}
        <a href="/gaming-moments" className="nav-link">
          Gaming Moments
        </a>
        <a href="/contact" className="nav-link">
          Contact
        </a>

        {/* Hamburger Icon */}
        <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu - Always show Home button */}
      <nav className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Home
        </a>
        <a href="/gaming-moments" className="nav-link" onClick={() => setMenuOpen(false)}>
          Gaming Moments
        </a>
        <a href="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
          Contact
        </a>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
      </nav>
    </header>
  );
}
