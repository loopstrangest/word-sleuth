import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { BackButton, SoundLow, SoundHigh, SoundOff, Star } from "./SVGAssets";
import partialSound from "../assets/audio/partial.mp3";
import "../styles/TopBar.css";
import { useCallback } from "react";

export default function TopBar({
  goBack,
  soundLevel,
  setSoundLevel,
  colorDark,
  worldsCompleted,
  onStarWorldClick,
  hideStars = false,
}) {
  const getVolume = useCallback((level) => {
    switch (level) {
      case "off":
        return 0.0;
      case "low":
        return 0.5;
      case "high":
        return 1.0;
      default:
        return 1.0;
    }
  }, []);

  const toggleSound = () => {
    let nextState;
    if (soundLevel === "low") {
      nextState = "high";
    } else if (soundLevel === "high") {
      nextState = "off";
    } else {
      nextState = "low";
    }

    if (nextState === "low" || nextState === "high") {
      const feedback = new Audio(partialSound);
      feedback.volume = getVolume(nextState);
      feedback.play();
    }

    setSoundLevel(nextState);
  };

  const allWorldsCompleted =
    Array.isArray(worldsCompleted) && worldsCompleted.length >= 3;

  return (
    <Box
      className="topbar-container"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Box>
        {!hideStars && worldsCompleted !== undefined && (
          <Box
            className={`stars-container ${
              allWorldsCompleted ? "completed" : ""
            }`}
            onClick={allWorldsCompleted ? onStarWorldClick : undefined}
            style={{ cursor: allWorldsCompleted ? "pointer" : "default" }}
          >
            {[1, 2, 3].map((worldNumber) => (
              <Star
                key={worldNumber}
                style={{
                  fill: worldsCompleted.includes(worldNumber)
                    ? "var(--grayDark)"
                    : "none",
                  stroke: "var(--grayDark)",
                  width: "42px",
                  height: "42px",
                  margin: "2px",
                }}
              />
            ))}

            {worldsCompleted.includes(4) && (
              <Star className="completed-star-world-four" />
            )}
          </Box>
        )}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Box onClick={toggleSound} sx={{ marginRight: 0.5 }}>
          {soundLevel === "low" && (
            <SoundLow
              className="sound-low"
              style={{
                width: "50px",
                height: "50px",
                stroke: colorDark,
              }}
            />
          )}
          {soundLevel === "high" && (
            <SoundHigh
              className="sound-high"
              style={{
                width: "50px",
                height: "50px",
                stroke: colorDark,
                fill: colorDark,
              }}
            />
          )}
          {soundLevel === "off" && (
            <SoundOff
              className="sound-off"
              style={{
                width: "50px",
                height: "50px",
                stroke: colorDark,
              }}
            />
          )}
        </Box>

        <Box onClick={goBack}>
          <BackButton
            className="back-button"
            style={{
              width: "50px",
              height: "50px",
              stroke: colorDark,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

TopBar.propTypes = {
  goBack: PropTypes.func.isRequired,
  soundLevel: PropTypes.string.isRequired,
  setSoundLevel: PropTypes.func.isRequired,
  colorDark: PropTypes.string.isRequired,
  worldsCompleted: PropTypes.arrayOf(PropTypes.number),
  onStarWorldClick: PropTypes.func,
  hideStars: PropTypes.bool,
};
