import React from "react";
import { AiOutlineDown } from "react-icons/ai";
import { HiOutlineVideoCamera } from "react-icons/hi";

function CourseSubSectionAccordion({ subSec }) {
  return (
    <div className="py-2 border-b border-richblack-600">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HiOutlineVideoCamera />
          <p className="font-semibold">{subSec?.TITLE}</p>
        </div>
        <span className="text-sm text-richblack-300">
          {`${subSec?.TIME_DURATION || 0} min`}
        </span>
      </div>
      <p className="text-richblack-400 text-sm mt-1">
        {subSec?.DESCRIPTION}
      </p>
    </div>
  );
}

export default CourseSubSectionAccordion;
