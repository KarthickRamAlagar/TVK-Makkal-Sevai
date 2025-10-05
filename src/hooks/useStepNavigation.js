// hooks/useStepNavigation.js
export const useStepNavigation = (formData, images) => {
  const isStepValid = (activeStep) => {
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

  return { isStepValid };
};
