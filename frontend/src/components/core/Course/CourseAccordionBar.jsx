import { useEffect, useRef, useState } from "react";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";
import { IoMdArrowDropdown } from "react-icons/io";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null);
  const [active, setActive] = useState(false);  // Accordion state
  const [sectionHeight, setSectionHeight] = useState(0);

  // Set active state based on the current course
  useEffect(() => {
    setActive(isActive?.includes(course.COURSE_ID));
  }, [isActive, course]);

  // Update height based on the active state
  useEffect(() => {
    if (contentEl.current) {
      setSectionHeight(active ? contentEl.current.scrollHeight : 0);
    }
  }, [active]);

  // Handle the accordion click event
  const handleClick = () => {
    handleActive(course.COURSE_ID);
    setActive(!active); // Toggle active state
  };

  return (
    <div className='overflow-hidden border border-solid border-richblack-600 bg-richblack-700 hover:bg-richblack-600 text-richblack-5 last:mb-0 duration-200'>
      <div>
        <div
          className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]"
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            <i className={active ? "rotate-180 duration-300" : "rotate-0 duration-300"}>
              <IoMdArrowDropdown size={25} />
            </i>
            <p>{course.sections[0]?.SECTION_NAME || "Section Name"}</p>
          </div>
          <div className="space-x-4">
            <span className="text-caribbeangreen-25">
              {`${course.sections[0]?.subSection?.length || 0} lecture(s)`}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <div
        ref={contentEl}
        className={`transition-[height] duration-[0.35s] ease-[ease] overflow-hidden`}
        style={{ height: `${sectionHeight}px` }}  // Set height dynamically
      >
        <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
          {course.sections[0]?.subSection?.map((subSec, i) => (
            <CourseSubSectionAccordion subSec={subSec} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
