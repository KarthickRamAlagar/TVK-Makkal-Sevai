import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual, useStore } from "react-redux";
import {
  setFormData,
  updateField,
  setComplaintId,
} from "../../redux/formSlice";
import { setUserRegistry } from "../../redux/userSlice";
import { getSteps } from "../../constants/stepsConfig.jsx";
import Alert from "../common/Alert.jsx";
import ThankYouScreen from "./ThankYouScreen";
import { Upload, User, MapPin, FileText, Eye } from "lucide-react";
import { generateComplaintId } from "../../utils/generateComplaintId";
import { addComplaint } from "../../redux/complaintsSlice";
import { addProofRegistry } from "../../redux/proofRegistrySlice";
import { COMPLAINT_STATUS } from "../../constants/status";

const StepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitLocked, setSubmitLocked] = useState(false);

  const dispatch = useDispatch();
  const store = useStore();

  const userData = useSelector((state) => state.user || {}, shallowEqual);
  const formData = useSelector((state) => state.form || {}, shallowEqual);
  const images = formData.images || [];

  useEffect(() => {
    const { userName, email, whatsapp, userId, role } = userData;
    dispatch(updateField({ name: "userName", value: userName || "" }));
    dispatch(updateField({ name: "email", value: email || "" }));
    dispatch(updateField({ name: "whatsapp", value: whatsapp || "" }));
    dispatch(updateField({ name: "userId", value: userId || "" }));
    dispatch(updateField({ name: "role", value: role || "user" }));
  }, [userData, dispatch]);

  useEffect(() => {
    if (formSubmitted && process.env.NODE_ENV === "development") {
      const userId = formData.userId;
      const complaintId = store.getState().form.complaintId;
      const payload = store.getState().proofRegistry?.[userId]?.[complaintId];
      console.log("🧾 Final proofRegistry entry:", payload);
    }
  }, [formSubmitted]);

  const stepIcons = {
    0: <Upload className="w-6 h-6" />,
    1: <User className="w-6 h-6" />,
    2: <MapPin className="w-6 h-6" />,
    3: <FileText className="w-6 h-6" />,
    4: <Eye className="w-6 h-6" />,
  };

  const isStepValid = () => {
    const {
      department,
      userName,
      userId,
      email,
      whatsapp,
      district,
      taluk,
      wardNo,
      complaintLetter,
    } = formData;

    switch (activeStep) {
      case 0:
        return images.length === 4;
      case 1:
        return department && userName && userId && email && whatsapp;
      case 2:
        return district && taluk && wardNo && complaintLetter;
      default:
        return true;
    }
  };

  const handleUpload = (files) => {
    if (!Array.isArray(files)) return;

    const currentImages = formData.images || [];
    const remainingSlots = 4 - currentImages.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setAlertMessage(
        `You can only upload ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""}.`
      );
      setShowAlert(true);
    }

    const structured = [...currentImages, ...filesToUpload].map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
    }));

    dispatch(updateField({ name: "images", value: structured }));
  };

  const handleLetterUpload = (file) => {
    if (!file) return;

    dispatch(
      updateField({
        name: "complaintLetter",
        value: {
          name: file.name,
          preview: URL.createObjectURL(file),
          file,
        },
      })
    );
  };

  const handleChange = (e) => {
    const { name, value } = e?.target || e;
    if (typeof name !== "string") {
      console.warn("Invalid handleChange input:", e);
      return;
    }
    dispatch(updateField({ name, value }));
  };

  const handleSubmitComplaint = () => {
    if (submitLocked) return;
    setSubmitLocked(true);

    new Audio("/audio/submit.mp3").play();

    const complaintId = generateComplaintId(formData.userId);
    const timestamp = new Date().toISOString();

    // ✅ Sync complaintId to form slice
    dispatch(setComplaintId(complaintId));
    dispatch(setFormData({ ...formData, complaintId }));
    console.log("📝 Form data synced with complaintId:", {
      ...formData,
      complaintId,
    });

    // ✅ Add complaint to complaint slice
    dispatch(
      addComplaint({
        complaintId,
        userId: formData.userId,
        department: formData.department,
        district: formData.district,
        taluk: formData.taluk,
        wardNo: formData.wardNo,
        timestamp,
        status: COMPLAINT_STATUS.APPEALED,
      })
    );
    console.log("📌 Complaint added:", complaintId);

    // ✅ Add proof registry entry
    dispatch(
      addProofRegistry({
        userId: formData.userId,
        complaintId,
        formSnapshot: { ...formData, complaintId },
        complaint: {
          complaintId,
          department: formData.department,
          district: formData.district,
          taluk: formData.taluk,
          wardNo: formData.wardNo,
          timestamp,
          status: COMPLAINT_STATUS.APPEALED,
          statusHistory: [{ status: COMPLAINT_STATUS.APPEALED, timestamp }],
          userFeedback: "",
          userName: formData.userName,
          email: formData.email,
          userId: formData.userId,
          whatsapp: formData.whatsapp,
          isSignedIn: userData.isSignedIn,
          isFirstTime: userData.isFirstTime,
        },
        proofs: {
          images: formData.images,
          complaintLetter: formData.complaintLetter,
        },
      })
    );
    console.log("📦 Proof registry updated for:", formData.userId);

    // ✅ Update user registry
    dispatch(
      setUserRegistry({
        ...userData.userRegistry,
        [formData.email]: {
          lastSubmitted: timestamp,
          complaintId,
        },
      })
    );
    console.log("👤 User registry updated:", formData.email);

    // ✅ Final confirmation
    setAlertMessage("Form submitted successfully!");
    setShowAlert(true);
    setFormSubmitted(true);

    // ✅ Snapshot Redux state for audit
    setTimeout(() => {
      const state = window.store.getState();
      console.log("🧾 Final Redux snapshot:");
      console.log("form:", state.form);
      console.log(
        "proofRegistry:",
        state.proofRegistry?.[formData.userId]?.[complaintId]
      );
      console.log("districtRegistry:", state.districtRegistry);
      console.log("user:", state.user);
    }, 500);
  };

  const steps = getSteps(
    formData,
    handleChange,
    handleLetterUpload,
    handleUpload
  );
  const visibleStepIndicators = steps.slice(stepIndex, stepIndex + 3);

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-0">
      {formSubmitted ? (
        <ThankYouScreen />
      ) : (
        <>
          {/* Stepper */}
          <div className="flex w-full md:w-4/4 relative mb-10 gap-0 items-center">
            {visibleStepIndicators.map((step, idx) => {
              const actualIdx = stepIndex + idx;
              const isActive = actualIdx === activeStep;
              const isCompleted = actualIdx < activeStep;

              return (
                <div
                  key={actualIdx}
                  className="flex-1 relative flex flex-col items-center"
                >
                  <div
                    onClick={() => {
                      if (actualIdx > activeStep && !isStepValid()) {
                        setAlertMessage(
                          "Please complete this step before moving forward."
                        );
                        setShowAlert(true);
                        return;
                      }
                      setActiveStep(actualIdx);
                      if (actualIdx < stepIndex) {
                        setStepIndex(Math.max(actualIdx - 1, 0));
                      }
                    }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center z-10 cursor-pointer ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white font-bold"
                        : isActive
                          ? "bg-white border-pink-500 text-pink-500 font-bold"
                          : "bg-white border-gray-400 text-gray-500"
                    }`}
                  >
                    {actualIdx + 1}
                  </div>
                  <span className="mt-2 text-xs md:text-sm font-semibold text-white text-center whitespace-nowrap">
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="inline md:hidden">
                      {stepIcons[actualIdx]}
                    </span>
                  </span>
                  {idx < visibleStepIndicators.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 h-[3px] w-full -translate-y-1/2 z-0 ${
                        actualIdx < activeStep ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="w-full md:w-4/4 mb-6">
            {steps[activeStep].component}
          </div>

          {/* Navigation */}
          <div
            className={`w-full md:w-4/4 mt-4 gap-2 flex ${
              activeStep === 0 ? "justify-center" : "justify-between"
            }`}
          >
            {activeStep > 0 && (
              <button
                onClick={() => {
                  const newStep = activeStep - 1;
                  setActiveStep(newStep);
                  if (newStep < stepIndex) {
                    setStepIndex(Math.max(newStep - 1, 0));
                  }
                }}
                className="bg-white text-pink-500 font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition w-full md:w-auto"
              >
                Prev
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  if (!isStepValid()) {
                    setAlertMessage(
                      "Please complete all required fields before proceeding."
                    );
                    setShowAlert(true);
                    return;
                  }
                  const newStep = activeStep + 1;
                  setActiveStep(newStep);
                  if (newStep >= stepIndex + 3) {
                    setStepIndex(Math.min(newStep - 2, steps.length - 3));
                  }
                }}
                disabled={!isStepValid()}
                className={`font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition w-full md:w-auto ${
                  isStepValid()
                    ? "bg-white text-pink-500"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitComplaint}
                disabled={submitLocked}
                className={`bg-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-md transition w-full md:w-auto ${
                  submitLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-pink-600 hover:shadow-lg"
                }`}
              >
                Submit
              </button>
            )}
          </div>

          {/* Alert */}
          <Alert
            message={alertMessage}
            show={showAlert}
            onClose={() => setShowAlert(false)}
          />
        </>
      )}
    </div>
  );
};

export default StepForm;
