import {
  StepOneUpload,
  StepTwoDetails,
  StepThreeLocation,
  StepFourReview,
  StepFiveReview,
} from "../components/user/Steps.jsx";

export const getSteps = (
  formData,
  handleChange,
  handleLetterUpload
) => [
  {
    label: "Upload Images",
    component: <StepOneUpload />,
  },
  {
    label: "User Details",
    component: (
      <StepTwoDetails formData={formData} handleChange={handleChange} />
    ),
  },
{
  label: "Location",
  component: (
    <StepThreeLocation
      formData={formData}
      handleChange={handleChange}
      onLetterUpload={handleLetterUpload}
    />
  ),
},

  {
    label: "Review Part 1",
    component: <StepFourReview formData={formData} />,
  },
  {
    label: "Review Part 2",
    component: <StepFiveReview formData={formData} />,
  },
];
