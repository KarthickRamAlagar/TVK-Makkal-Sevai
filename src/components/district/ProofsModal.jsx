"use client";

import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { BotIcon } from "lucide-react";
import PDFCanvasViewer from "../../utils/PDFCanvasViewer";
import { generateComplaintSummary } from "../../utils/aiSummaryUtils";
import { marked } from "marked";
import DOMPurify from "dompurify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const mockComplaint = {
  complaintId: "CMP-2025-0912",
  proofs: {
    images: [
      "/assets/B1.png",
      "/assets/B2.jpg",
      "/assets/B4.png",
      "/assets/B5.png",
    ],
    document: "/ComplaintLetter.pdf",
    mimeType: "application/pdf",
  },
};

export function ProofsModal({ isOpen, onClose, onOpenNextModal }) {
  const { proofs } = mockComplaint || {};
  const { images, document } = proofs || {};

  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [languageUIVisible, setLanguageUIVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [summary, setSummary] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [toggleVisible, setToggleVisible] = useState(false);
  const summaryRef = useRef(null);
  const languageRef = useRef(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = (index) => {
    autoplay.current.stop();
    emblaApi?.scrollTo(index);
  };

  const handleLanguageClick = () => {
    setLanguageUIVisible(true);
    setTimeout(() => {
      languageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleExpandClick = async () => {
    setIsExtracting(true);
    const result = await generateComplaintSummary(document, selectedLanguage);
    setSummary(result);
    setShowSummary(true);
    setIsExtracting(false);

    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);

    setTimeout(() => {
      setToggleVisible(true);
    }, 1000);
  };

  const handleFinalAction = () => {
    onClose();
    onOpenNextModal?.();
  };

  const renderComplaintContent = () => {
    if (!document) {
      return (
        <p className="text-gray-400 italic">No complaint letter attached.</p>
      );
    }

    if (showSummary && !showFullLetter && summary) {
      return (
        <div
          ref={summaryRef}
          className="prose prose-lg max-w-none text-gray-800"
        >
          <h4 className="text-2xl font-bold text-green-700 mb-4">
            Complaint Summary
          </h4>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(summary)),
            }}
          />
        </div>
      );
    }

    return <PDFCanvasViewer url={document} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full max-w-4xl px-4 sm:px-6 md:px-8 bg-white overflow-y-auto max-h-[90vh] md:rounded-lg"
        aria-busy={isExtracting}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-sans font-bold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Review submitted images and complaint letter.
          </DialogTitle>

          {mockComplaint?.complaintId && (
            <DialogDescription className="text-xl font-bold text-green-600 text-center">
              <span className="text-violet-800 text-2xl font-bold">
                Complaint ID:
              </span>{" "}
              {mockComplaint.complaintId}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* 🖼️ Image Carousel */}
        <div className="relative w-full max-w-3xl mx-auto mb-6 min-h-[300px] rounded-2xl p-4 bg-white shadow-[0_4px_12px_rgba(239,68,68,0.6),0_2px_8px_rgba(234,179,8,0.6)]">
          {images?.length ? (
            <>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="flex-[0_0_100%] p-2 flex justify-center items-center"
                    >
                      <img
                        src={src}
                        alt={`Proof ${idx + 1}`}
                        className="rounded-full max-h-[250px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollTo(idx)}
                    className={`w-4 h-4 rounded-full transition ${
                      selectedIndex === idx
                        ? "bg-green-500 scale-110"
                        : "bg-green-300"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 italic text-center mt-20">
              No images submitted.
            </p>
          )}
        </div>

        {/* 📄 Complaint Letter Viewer */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-violet-800">
            Complaint Letter
          </h3>

          {toggleVisible && (
            <motion.button
              onClick={() => setShowFullLetter((prev) => !prev)}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              disabled={isExtracting}
              className={`w-16 h-8 flex items-center rounded-full px-1 transition-colors duration-300 ${
                showFullLetter ? "bg-green-600" : "bg-gray-400"
              } ${isExtracting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-6 h-6 bg-white rounded-full shadow-md"
                style={{
                  transform: showFullLetter
                    ? "translateX(32px)"
                    : "translateX(0px)",
                }}
              />
            </motion.button>
          )}
        </div>

        <div className="relative border rounded-lg shadow-lg shadow-gray-400 p-4 bg-white w-full md:mx-auto md:w-[90%]">
          {/* Complaint Viewer Content */}
          <div className="max-h-[500px] overflow-y-auto">
            {renderComplaintContent()}
          </div>

          {/* Scoped AI Overlay */}
          {isExtracting && (
            <div className="absolute inset-0 z-50 backdrop-blur-sm bg-white/60 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-20 h-20 flex items-center justify-center rounded-full bg-green-600 shadow-xl"
              >
                <BotIcon className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          )}
        </div>

        {/* 🌐 Language Selection Trigger */}
        <button
          onClick={handleLanguageClick}
          className="mt-8 w-full py-4 text-white font-bold text-xl sm:text-2xl rounded-full bg-gradient-to-r from-red-500 to-yellow-500 hover:opacity-90 transition"
        >
          Choose Language for Summarization of Complaint
        </button>

        {/* 🌐 Language Selector + AI Button */}
        {languageUIVisible && (
          <div
            ref={languageRef}
            className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          >
            <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
              {["english", "tamil", "urdu"].map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 text-lg text-gray-700 font-medium"
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={selectedLanguage === lang}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="capitalize">
                    {lang === "english"
                      ? "English"
                      : lang === "tamil"
                        ? "தமிழ்"
                        : "اُردُو"}
                  </span>
                </label>
              ))}
            </div>

            <motion.button
              onClick={handleExpandClick}
              disabled={!selectedLanguage || isExtracting}
              initial={{ scale: 1 }}
              animate={
                isExtracting
                  ? { scale: 1.2, rotate: 360 }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-white transition ${
                selectedLanguage
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <BotIcon className="w-8 h-8" />
            </motion.button>
          </div>
        )}

        {/* ✅ Final Action Button */}
        {showSummary && (
          <button
            onClick={handleFinalAction}
            className="mt-10 w-full py-4 text-white font-bold text-xl rounded-full bg-gradient-to-r from-green-600 to-green-400 hover:opacity-90 transition"
          >
            Proceed to Next Step
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
