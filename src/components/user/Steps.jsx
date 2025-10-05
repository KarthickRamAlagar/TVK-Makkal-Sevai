import React, { useRef, useState, useEffect } from "react";
import {
  User,
  Mail,
  Hash,
  MapPin,
  Smartphone,
  BadgeCheck,
  Globe,
  MapPinned,
} from "lucide-react";
import DepartmentAutocomplete from "../common/DepartmentAutocomplete.jsx";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../../redux/formSlice";
import Alert from "../common/Alert.jsx";
import DistrictAutocomplete from "../common/DistrictAutocomplete.jsx";
import { DISTRICTS } from "../../constants/districts";

// Step 1: Upload Images
export const StepOneUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const reduxImages = useSelector((state) => state.form.images || []);
  const [localFiles, setLocalFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleClick = () => {
    if (localFiles.length >= 4) {
      setAlertMessage("You can upload a maximum of 4 images.");
      setShowAlert(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const validFiles = selectedFiles.filter((file) =>
      allowedTypes.includes(file.type)
    );

    const remainingSlots = 4 - reduxImages.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (selectedFiles.length > remainingSlots) {
      setAlertMessage(
        `You can only upload ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        }.`
      );
      setShowAlert(true);
    }

    if (validFiles.length < selectedFiles.length) {
      setAlertMessage("Only JPG, JPEG, PNG, and WEBP formats are allowed.");
      setShowAlert(true);
    }

    const metadata = filesToUpload.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      file, // ✅ Include actual file for ZIP bundling
    }));

    // ✅ Merge with existing Redux images
    const existingImages = reduxImages || [];
    const updatedImages = [...existingImages, ...metadata].slice(0, 4);

    dispatch(updateField({ name: "images", value: updatedImages }));

    // ✅ Sync local state for UI preview
    setLocalFiles((prev) => [...prev, ...filesToUpload].slice(0, 4));

    e.target.value = ""; // reset input
  };

  useEffect(() => {
    return () => {
      reduxImages.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [reduxImages]);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        className={`w-full bg-white shadow-md border-2 ${
          localFiles.length < 4
            ? "border-red-500 cursor-pointer"
            : "border-gray-300 cursor-not-allowed"
        } border-dashed rounded-2xl h-48 flex flex-col items-center justify-center hover:shadow-lg transition`}
        onClick={handleClick}
      >
        <div
          className={`rounded-full p-3 text-transparent bg-clip-text ${
            localFiles.length < 4
              ? "bg-gradient-to-r from-red-500 to-yellow-400"
              : "bg-gradient-to-r from-gray-400 to-gray-500"
          } text-4xl`}
        >
          +
        </div>
        {localFiles.length === 0 ? (
          <p className="mt-2 text-gray-500 font-medium">
            Image (JPG, JPEG, PNG, WEBP)
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            {localFiles.length}/4 images uploaded
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {reduxImages.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-32 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition hover:scale-105 border-2 border-red-500 bg-white"
          >
            <img
              src={img.preview}
              alt={`upload-${idx}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

//step2
export const StepTwoDetails = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);
  const handleChange = (e) => {
    const { name, value } = e?.target || e;
    if (typeof name === "string" && value !== undefined) {
      dispatch(updateField({ name, value }));
    } else {
      console.warn("Invalid handleChange input:", e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 sm:px-6">
      <div className="w-90 -mx-12 px-4 sm:px-6  rounded-[50px] h-12  outline-none">
        <DepartmentAutocomplete
          value={formData.department}
          onChange={handleChange} // ✅ No wrapper
          lang="en"
          name="department"
          placeholder="Select your department"
        />
      </div>
      {["userName", "userId", "email", "whatsapp"].map((field) => (
        <input
          key={field}
          type={field === "email" ? "email" : "text"}
          name={field}
          placeholder={field}
          value={formData[field] || ""}
          onChange={handleChange}
          className="w-90  -mx-8 md:-mx-7 px-4 sm:px-6 border-2 border-red-500 focus:border-yellow-400 rounded-[50px] h-12 shadow-md hover:shadow-lg focus:shadow-xl outline-none"
        />
      ))}
    </div>
  );
};

// Step 3: Location + Letter Upload

export const StepThreeLocation = ({
  formData,
  handleChange,
  onLetterUpload,
}) => {
  const fileInputRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleLetterClick = () => {
    if (formData.complaintLetter) {
      setAlertMessage("You can only upload one complaint letter.");
      setShowAlert(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setAlertMessage("Only PDF and Word documents are allowed.");
        setShowAlert(true);
        return;
      }

      setSelectedFileName(file.name);
      onLetterUpload(file);
    }
    e.target.value = "";
  };

  return (
    <div className="w-full flex flex-col gap-4 px-0 sm:px-6">
      {/* District Autocomplete */}
      <div className="w-90 sm:px-6 rounded-[50px] h-12  outline-none -mx-6  ">
        <DistrictAutocomplete
          value={formData.district}
          onChange={handleChange} // ✅ No wrapper
          options={DISTRICTS}
          name="district"
          placeholder="Select your district"
        />
      </div>

      {/* Taluk & Ward No Inputs */}
      {["taluk", "wardNo"].map((field) => (
        <input
          key={field}
          type={field === "wardNo" ? "number" : "text"}
          name={field}
          placeholder={field === "taluk" ? "Taluk (Madurai East)" : "Ward No"}
          value={formData[field] || ""}
          onChange={handleChange}
          min={field === "wardNo" ? "1" : undefined}
          step={field === "wardNo" ? "1" : undefined}
          className="w-90 px-4 sm:px-6 border-2 border-red-500 focus:border-yellow-400 rounded-[50px] h-12 shadow-md hover:shadow-lg focus:shadow-xl outline-none -mx-5  md:mx-0"
        />
      ))}

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Complaint Letter Upload Box */}
      <div
        className="w-90 bg-white shadow-md border-2 border-red-500 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition mt-2 px-4 -mx-4 md:-mx-0"
        onClick={handleLetterClick}
      >
        <div className="rounded-full p-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 text-3xl cursor-pointer">
          +
        </div>
        <p className="mt-1 text-gray-500 font-medium">
          {selectedFileName || "Upload Complaint Letter (.pdf, .doc, .docx)"}
        </p>
      </div>

      {/* Alert */}
      <Alert
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

// Step 4: Review (Part 1)
export const StepFourReview = () => {
  const formData = useSelector((state) => state.form);
  const keysToShow = ["department", "userName", "userId", "email"];
  const iconMap = {
    department: <BadgeCheck className="inline-block mr-2" />,
    userName: <User className="inline-block mr-2" />,
    userId: <Hash className="inline-block mr-2" />,
    email: <Mail className="inline-block mr-2" />,
  };

  return (
    <div className="w-full flex flex-col gap-4 px-0 sm:px-6">
      {keysToShow.map((key) => (
        <div
          key={key}
          className="w-90 -mx-5 px-4 py-3 border-2 border-yellow-400 rounded-[30px] sm:rounded-[50px] bg-gray-100 text-gray-700 font-semibold shadow-md hover:shadow-lg transition"
        >
          <div className="flex flex-wrap items-center gap-2">
            {iconMap[key]}
            <span className="capitalize md:text-xl text-lg">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span className="text-red-600 md:text-xl text-lg">
              {formData[key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Step 5: Review (Part 2)
export const StepFiveReview = () => {
  const formData = useSelector((state) => state.form);
  const keysToShow = ["whatsapp", "district", "taluk", "wardNo"];
  const iconMap = {
    whatsapp: <Smartphone className="inline-block mr-2" />,
    district: <Globe className="inline-block mr-2" />,
    taluk: <MapPin className="inline-block mr-2" />,
    wardNo: <MapPinned className="inline-block mr-2" />,
  };

  return (
    <div className="w-full flex flex-col gap-4 px-0 sm:px-6">
      {keysToShow.map((key) => (
        <div
          key={key}
          className="w-90 -mx-5 px-4 py-3 border-2 border-yellow-400 rounded-[30px] sm:rounded-[50px] bg-gray-100 text-gray-700 font-semibold shadow-md hover:shadow-lg transition"
        >
          <div className="flex flex-wrap items-center gap-2">
            {iconMap[key]}
            <span className="capitalize md:text-xl text-lg">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span className="text-red-600 md:text-xl text-lg">
              {formData[key]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
