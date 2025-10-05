// hooks/useImageUpload.js
import { updateField } from "../redux/formSlice";

export const useImageUpload = (
  images,
  dispatch,
  setAlertMessage,
  setShowAlert
) => {
  const handleUpload = (files) => {
    if (!Array.isArray(files)) return;

    const remainingSlots = 4 - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setAlertMessage(
        `You can only upload ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        }.`
      );
      setShowAlert(true);
    }

    dispatch(
      updateField({ name: "images", value: [...images, ...filesToUpload] })
    );
  };

  return { handleUpload };
};
