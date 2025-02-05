import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import "../styles/MenuAndCredits.css";
import Credits from "./Credits";
import { unlockAudio } from "../utils/audioContext";

export default function MainMenu({ onPlay }) {
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const handleNavigateToMainMenu = () => {
      setShowCredits(false);
    };

    window.addEventListener("navigateToMainMenu", handleNavigateToMainMenu);

    return () => {
      window.removeEventListener(
        "navigateToMainMenu",
        handleNavigateToMainMenu
      );
    };
  }, []);

  if (showCredits) {
    return <Credits />;
  }

  function handlePlayClick() {
    unlockAudio();
    onPlay();
  }

  return (
    <Box className="root-mainmenu">
      <Typography
        variant="h1"
        className="mainmenu-title"
        style={{ fontFamily: "Helvetica" }}
      >
        word sleuth
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        <Box onClick={handlePlayClick} className="mainmenu-button">
          <Typography align="center">Play</Typography>
        </Box>
        <Box onClick={() => setShowCredits(true)} className="mainmenu-button">
          <Typography align="center">Credits</Typography>
        </Box>
      </Box>
    </Box>
  );
}

MainMenu.propTypes = {
  onPlay: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  soundLevel: PropTypes.string.isRequired,
  setSoundLevel: PropTypes.func.isRequired,
};
