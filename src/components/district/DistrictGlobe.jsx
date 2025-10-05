import React, { useEffect, useRef, useMemo, useState } from "react";
import Globe from "react-globe.gl";
import { useSelector } from "react-redux";
import { districtLabels } from "../../constants/districtLabels";
import Alert from "../common/Alert";


const DistrictGlobe = () => {
  const globeRef = useRef();
  const audioRef = useRef(null);
  const userDistrict = useSelector((state) => state.user.district);

  const [currentAlert, setCurrentAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioEnded, setIsAudioEnded] = useState(true);
  const [globeSize, setGlobeSize] = useState({ width: 500, height: 500 });
  const DistrictAudio = new URL("/district-theme.mp3", import.meta.url).href;

  //  Responsive globe sizing
  useEffect(() => {
    const updateGlobeSize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setGlobeSize({ width: 600, height: 600 });
      } else if (width >= 768) {
        setGlobeSize({ width: 500, height: 500 });
      } else {
        setGlobeSize({ width: width - 40, height: width - 40 });
      }
    };

    updateGlobeSize();
    window.addEventListener("resize", updateGlobeSize);
    return () => window.removeEventListener("resize", updateGlobeSize);
  }, []);

  //  Filter label for user district
  const userLabel = useMemo(() => {
    if (!userDistrict) return [];
    const normalizedDistrict = userDistrict.trim().toLowerCase();
    return districtLabels.filter((label) =>
      label.text.toLowerCase().includes(normalizedDistrict)
    );
  }, [userDistrict]);

  //  Auto-rotate setup
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = -1.2;
    }
  }, []);

  //  Focus on user district
  useEffect(() => {
    if (!globeRef.current || userLabel.length === 0) return;
    const { lat, lng } = userLabel[0];
    globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1500);
  }, [userLabel]);

  //  Initialize audio
  useEffect(() => {
    const audio = new Audio(DistrictAudio);
    audio.volume = 0.4;
    audio.muted = isMuted;

    const handleEnded = () => setIsAudioEnded(true);
    const handleReady = () => {
      audioRef.current = audio;
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleReady);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleReady);
    };
  }, []);

  // Play audio safely
  const playAudio = async () => {
    if (!audioRef.current || isMuted) return;
    try {
      await audioRef.current.play();
      setIsAudioEnded(false);
      setHasInteracted(true);
      localStorage.setItem("districtAudioPlayed", "true");
    } catch (err) {
      console.warn("Audio playback failed:", err);
      setCurrentAlert("🔇 Audio blocked until user interacts");
      setShowAlert(true);
    }
  };

  //  Initial interaction triggers audio
  useEffect(() => {
    const interactedBefore = localStorage.getItem("districtAudioPlayed");
    if (interactedBefore) setHasInteracted(true);
  }, []);

  useEffect(() => {
    if (hasInteracted || !audioRef.current) return;

    const handleInitialInteraction = async () => {
      await playAudio();
      window.removeEventListener("click", handleInitialInteraction);
      window.removeEventListener("keydown", handleInitialInteraction);
    };

    window.addEventListener("click", handleInitialInteraction);
    window.addEventListener("keydown", handleInitialInteraction);

    return () => {
      window.removeEventListener("click", handleInitialInteraction);
      window.removeEventListener("keydown", handleInitialInteraction);
    };
  }, [isMuted, hasInteracted]);

  // Replay on double-click or scroll if audio ended
  useEffect(() => {
    const handleReplay = async (e) => {
      if (
        e.target &&
        typeof e.target.closest === "function" &&
        e.target.closest("button[aria-label='Toggle Sound']")
      ) {
        return;
      }
      if (isAudioEnded) await playAudio();
    };

    window.addEventListener("dblclick", handleReplay);
    window.addEventListener("wheel", handleReplay);

    return () => {
      window.removeEventListener("dblclick", handleReplay);
      window.removeEventListener("wheel", handleReplay);
    };
  }, [isMuted, isAudioEnded]);

  // Alert triggers for district and motivation
  useEffect(() => {
    if (!userDistrict) return;
    const timers = [];

    timers.push(
      setTimeout(() => {
        triggerAlert(`Your Authorized District: ${userDistrict}`, 2000);
      }, 3000)
    );

    const motivationalMessages = [
      "Empower Your District",
      "Strength Through Unity",
      "Lead With Accountability",
      "Progress Through Transparency",
      "Together for Justice",
    ];

    motivationalMessages.forEach((msg, index) => {
      timers.push(
        setTimeout(() => triggerAlert(msg, 2000), 12000 + index * 3000)
      );
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [userDistrict]);

  // Alert helper
  const triggerAlert = (message, duration = 2000) => {
    setCurrentAlert(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), duration);
  };

  //  Mute toggle
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev;
      if (audioRef.current) audioRef.current.muted = newMute;
      return newMute;
    });
  };

  return (
    <div className="flex justify-center items-center">
      {/* Alert */}
      <Alert
        message={currentAlert}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />

      {/* Audio Control */}
      <div className="absolute top-4 left-4 z-10">
        {!hasInteracted ? (
          <button
            onClick={playAudio}
            className=" text-white px-4 py-2 text-xl rounded-full  hover:bg-green-700 transition"
          >
            🔊
          </button>
        ) : (
          <button
            onClick={toggleMute}
            className="bg-white/80 text-black text-xl p-2 rounded-full shadow-md hover:bg-white transition-all"
            aria-label="Toggle Sound"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        )}
      </div>

      {/* Globe */}
      <Globe
        ref={globeRef}
        width={globeSize.width}
        height={globeSize.height}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere
        showGraticules
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        labelsData={userLabel}
        labelDotRadius={0.3}
        labelAltitude={0.01}
        labelText={(d) => d.text}
        labelColor={() => "red"}
        labelTextColor={() => "white"}
        labelResolution={2}
        onLabelClick={(label) => {
          triggerAlert(`Welcome to ${label.text}`, 2000);
          globeRef.current.pointOfView(
            { lat: label.lat, lng: label.lng, altitude: 1.5 },
            1000
          );
        }}
      />
    </div>
  );
};

export default DistrictGlobe;
