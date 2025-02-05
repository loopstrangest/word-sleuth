import { useState } from "react";
import { Box, Typography } from "@mui/material";
import "../styles/MenuAndCredits.css";
import { Twitter, Home, Instagram, Bluesky, StudioLogo } from "./SVGAssets";
import { dispatchEventCompat } from "../utils/dispatchEventCompat";

export default function Credits() {
  const [shareText, setShareText] = useState("Share");

  const handleBackgroundClick = () => {
    // Use the compatibility helper for older iOS Safari
    dispatchEventCompat("navigateToMainMenu");
  };

  const handleLinkClick = (e) => {
    // Prevent the background click handler from triggering
    e.stopPropagation();
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const textToCopy =
      "🔎 Play Word Sleuth 🔎\nhttps://strangestloop.io/word-sleuth";
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setShareText("Copied!");
        setTimeout(() => setShareText("Share"), 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // New function to open the feedback form in a new tab
  const handleFeedbackClick = (e) => {
    e.stopPropagation();
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSfCoxVGZhCClHDH2WBUNfFTO7OeJoZUmJVebxhQc5-PjO8xgA/viewform?usp=sharing",
      "_blank"
    );
  };

  return (
    <Box className="root-credits" onClick={handleBackgroundClick}>
      <Box className="credits-image-container">
        <StudioLogo className="credits-image" />
      </Box>
      <Box className="social-links" onClick={handleLinkClick}>
        <a
          href="https://twitter.com/strangestloop"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="social-icon" />
        </a>
        <a
          href="https://strangestloop.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Home className="social-icon" />
        </a>
        <a
          href="https://instagram.com/strangest.loop"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="social-icon" />
        </a>
        <a
          href="https://bsky.app/profile/strangestloop.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Bluesky className="social-icon" />
        </a>
      </Box>
      <Box className="credits-button" onClick={handleShareClick}>
        <Typography align="center">{shareText}</Typography>
      </Box>
      <Box className="credits-button" onClick={handleFeedbackClick}>
        <Typography align="center">Feedback</Typography>
      </Box>
    </Box>
  );
}
