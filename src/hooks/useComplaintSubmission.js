import { useSelector } from "react-redux";
import { generateComplaintId } from "../utils/generateComplaintId";
import { addProofRegistry } from "../redux/proofRegistrySlice";
import { setUserRegistry } from "../redux/userSlice";
import { setComplaintId } from "../redux/formSlice";
import { incrementDistrictStat } from "../redux/districtRegistrySlice";
import { COMPLAINT_STATUS } from "../constants/status";

export const useComplaintSubmission = (
  formData,
  userData,
  dispatch,
  setAlertMessage,
  setShowAlert,
  setFormSubmitted,
  setSubmitLocked,
  submitLocked
) => {
  const { isSignedIn, isFirstTime } = useSelector((state) => state.user);
  const districtRegistry = useSelector((state) => state.districtRegistry);

  const handleSubmitComplaint = () => {
    if (submitLocked) return;
    setSubmitLocked(true);

    new Audio("/audio/submit.mp3").play();

    const complaintId = generateComplaintId(formData.userId);
    const timestamp = new Date().toISOString();
    dispatch(setComplaintId(complaintId));

    // ✅ Normalize district input
    const normalizedDistrict = (formData.district || "")
      .toString()
      .trim()
      .toLowerCase();

    console.log("🧾 Submitting complaint for district:", normalizedDistrict);

    if (!normalizedDistrict) {
      console.error("❌ Cannot submit complaint: district is empty", formData);
      setAlertMessage("Please select/enter a district");
      setShowAlert(true);
      setSubmitLocked(false);
      return;
    }

    // ✅ Increment district stats
    dispatch(
      incrementDistrictStat({
        district: normalizedDistrict,
        status: "totalcount",
      })
    );
    dispatch(
      incrementDistrictStat({
        district: normalizedDistrict,
        status: COMPLAINT_STATUS.APPEALED,
      })
    );

    // ✅ Process images
    const processedImages = formData.images.map((img) => {
      const preview = img.file ? URL.createObjectURL(img.file) : img.preview;
      return { ...img, preview, file: img.file || null };
    });

    // ✅ Process complaint letter
    const complaintLetterFile = formData.complaintLetter;
    const complaintLetterPreview = complaintLetterFile
      ? URL.createObjectURL(complaintLetterFile)
      : "";
    console.log("🧾 Submitting complaint for:", {
      userId: formData.userId,
      complaintId,
      district: formData.district,
    });

    // ✅ Add proof registry
    dispatch(
      addProofRegistry({
        userId: formData.userId,
        complaintId,
        formSnapshot: { ...formData },
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
          isSignedIn,
          isFirstTime,
        },
        proofs: {
          images: processedImages,
          complaintLetter: {
            name: complaintLetterFile?.name || "",
            preview: complaintLetterPreview,
            file: complaintLetterFile || null,
          },
        },
        districtRegistrySnapshot: { ...districtRegistry },
      })
    );

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

    // ✅ Alert success
    setAlertMessage("Form submitted successfully!");
    setShowAlert(true);
    setFormSubmitted(true);
  };

  return { handleSubmitComplaint };
};
