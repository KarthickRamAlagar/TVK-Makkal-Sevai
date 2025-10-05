import React from "react";
import StepForm from "./StepForm";

const Form = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-8xl flex flex-col lg:flex-row items-start justify-between p-6 sm:p-8 mt-8 gap-8 lg:gap-12">
      {/* Left Visual Section */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h4 className="text-3xl sm:text-xl md:text-4xl my-2 font-extrabold  tracking-wide text-white text-center px-4  max-w-xs sm:max-w-sm md:max-w-full">
          உங்கள் துயிர் நீக்க!
        </h4>
        <img
          src="/assets/flag.jpg"
          alt="Profile"
          className="w-full max-w-[450px] h-auto md:max-w-[500px] lg:max-w-[550px] object-cover rounded-lg mt-2"
        />
      </div>

      {/* Right Multistep Form Section */}
      <div className="flex-1 flex flex-col items-center justify-start w-full">
        <StepForm />
      </div>
    </div>
  );
};

export default Form;
