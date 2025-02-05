import { useEffect } from "react";
import App from "./App.jsx";

export default function Root() {
  useEffect(() => {
    // Set initial vh unit
    setVhUnit();

    // Update vh on resize
    window.addEventListener("resize", setVhUnit);

    // Toggle our #root back to visible once everything is ready
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.display = "block";
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", setVhUnit);
    };
  }, []);

  return <App />;
}

function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
