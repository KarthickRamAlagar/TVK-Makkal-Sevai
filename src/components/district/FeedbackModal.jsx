import React, { useState, useEffect } from "react";
import { X, BotMessageSquare } from "lucide-react";
import { summarize } from "../../utils/summarizeUtils";

const FeedbackModal = ({
  isOpen,
  onClose,
  selectedFeedback,
  setSelectedFeedback,
  feedbackReason,
  complaintId,
  setFeedbackReason,
  onReset,
}) => {
  const [tempFeedback, setTempFeedback] = useState("");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempFeedback(selectedFeedback || "");
      setShowLanguageOptions(false);
      setSelectedLanguage("");
    }
  }, [isOpen, selectedFeedback]);

  const options = ["Satisfactory", "Not Satisfactory"];
  const isSummaryPresent = feedbackReason.trim().startsWith("•");
  const isRTL = ["urdu", "arabic"].includes(selectedLanguage);

  const handleConfirm = () => {
    setSelectedFeedback(tempFeedback);
    onClose();
  };

  const handleSummarize = async () => {
    if (!feedbackReason.trim() || !selectedLanguage) return;
    setIsSummarizing(true);

    try {
      const summary = await summarize(feedbackReason, selectedLanguage);
      if (summary) {
        const uniqueLines = [...new Set(summary.split("\n"))].join("\n");
        setFeedbackReason(uniqueLines);
      } else {
        throw new Error("All summarization models failed");
      }
    } catch (error) {
      console.error("Summarization failed:", error);
      setFeedbackReason("• Unable to summarize feedback at this time.");
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-6 flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-6 right-4 bg-red-500 text-white rounded-lg hover:text-yellow-300"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-yellow-400 bg-clip-text text-transparent">
            Select User Feedback
          </h2>
        </div>
        {complaintId && (
          <div className="text-purple-600 font-bold text-lg md:text-xl">
            Complaint ID:
            <span className=" text-green-500 px-2 py-1 text-xl font-bold">
              {complaintId}
            </span>
          </div>
        )}
        {/* Feedback Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-gray-700 text-lg"
            >
              <input
                type="radio"
                name="feedback"
                value={option}
                checked={tempFeedback === option}
                onChange={() => setTempFeedback(option)}
                className="w-6 h-6 accent-pink-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        {/* Reason Input or Summary Display */}
        {tempFeedback && (
          <>
            {isSummarizing ? (
              <div className="text-gray-600 text-lg italic">Summarizing...</div>
            ) : isSummaryPresent ? (
              <div
                className={`whitespace-pre-line text-lg leading-relaxed p-4 border border-gray-300 rounded-xl bg-gray-50 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
                dangerouslySetInnerHTML={{ __html: feedbackReason }}
              />
            ) : (
              <textarea
                placeholder={
                  tempFeedback === "Satisfactory"
                    ? "You may share what satisfied you..."
                    : "Please explain why you're not satisfied..."
                }
                value={feedbackReason}
                onChange={(e) => setFeedbackReason(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl text-lg text-gray-700 mt-4 whitespace-pre-line"
                rows={6}
                style={{ overflowY: "auto" }}
              />
            )}
          </>
        )}

        {/* AI Summarize Section */}
        {tempFeedback && feedbackReason.trim() && (
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => setShowLanguageOptions(!showLanguageOptions)}
              className="px-6 py-3 rounded-xl font-bold shadow-md bg-gradient-to-r from-red-500 to-yellow-500 hover:opacity-90 text-white transition text-lg"
            >
              Choose Language for AI Summary
            </button>

            {showLanguageOptions && (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-6 flex-wrap">
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

                {!isSummarizing && (
                  <div className="ml-auto">
                    <button
                      onClick={handleSummarize}
                      disabled={!selectedLanguage}
                      className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition ${
                        selectedLanguage
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <BotMessageSquare className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={handleConfirm}
            disabled={!tempFeedback || !isSummaryPresent}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempFeedback && isSummaryPresent
                ? "bg-pink-600 hover:bg-pink-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Selection
          </button>

          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            disabled={!tempFeedback || !isSummaryPresent}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold shadow-md transition text-center ${
              tempFeedback && isSummaryPresent
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Reset
          </button>
        </div>

        {/* Summarizing Backdrop */}
        {isSummarizing && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-50">
            <button
              disabled
              className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center shadow-xl animate-pulse"
            >
              <BotMessageSquare className="w-8 h-8 animate-spin" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
