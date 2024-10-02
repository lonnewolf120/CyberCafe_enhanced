import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from './../../common/IconBtn';
import { setCourseViewSidebar } from "../../../slices/sidebarSlice"

import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"

import { IoMdClose } from 'react-icons/io'
import { HiMenuAlt1 } from 'react-icons/hi'



export default function VideoDetailsSidebar({ setReviewModal }) {

  const [activeStatus, setActiveStatus] = useState("") // store curr section id
  const [videoBarActive, setVideoBarActive] = useState("") // store curr SubSection Id
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();
  const { COURSE_ID, sectionId, SUBSECTION_ID } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const { courseViewSidebar } = useSelector(state => state.sidebar)
  // console.log(user)
  async function getCourseData(){
    //TODO: add the api to extract course)

  }

  console.log("Course Section Data: ", courseSectionData)
  console.log("Course Entire Data: ", courseEntireData)
  console.log("Total lectures: ",     totalNoOfLectures )
  console.log("Completed lectures: ", completedLectures)
  // set which section - subSection is selected 
  useEffect(() => {
    ; (() => {
      // if (!courseSectionData?.length) return
      let currentSectionIndx;
      courseSectionData?.map((data, ind) =>{
        if(data.SECTION_ID === sectionId) currentSectionIndx = ind;
        })
      let currentSubSectionIndx;
      courseSectionData[currentSectionIndx]?.subSection?.map((data,ind) => {
        if(data.SUBSECTION_ID === SUBSECTION_ID) currentSubSectionIndx = ind;
      })
      const activeSUBSECTION_ID = courseSectionData[currentSectionIndx]?.subSection[currentSubSectionIndx]?.SUBSECTION_ID
      console.log("currentSectionIndx: ",currentSectionIndx)
      console.log("currentSubSectionIndx: ",currentSubSectionIndx)
      console.log("activeSUBSECTION_ID: ",activeSUBSECTION_ID)
      
      setActiveStatus(courseSectionData?.[currentSectionIndx]?.SECTION_ID)
      setVideoBarActive(activeSUBSECTION_ID)
    })()
  }, [])




  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">

            {/* open - close side bar icons */}
            <div
              className="sm:hidden text-white cursor-pointer "
              onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
            >
              {courseViewSidebar ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />}
            </div>

            {/* go back dashboard */}
            <button
              onClick={() => { navigate(`/dashboard/enrolled-courses`) }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </button>

            {/* add review button */}
            <IconBtn
              text="Add Review"
              // customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>

          {/* course Name - total No Of Lectures*/}
          <div className="flex flex-col">
            <p>{courseEntireData?.COURSE_NAME}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>


        {/* render all section -subSection */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData && courseSectionData?.map((section, index) => (
            // console.log("section data:",section),
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(section?.SECTION_ID)}
              key={index}
            >
              {/* Section */}
              <div className="flex justify-between bg-richblack-700 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.SECTION_NAME}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-medium">
                    Lession {section?.subSection?.length}
                  </span>
                  <span
                    className={`${activeStatus === section?.SECTION_ID
                      ? "rotate-0 transition-all duration-500"
                      : "rotate-180"
                      } `}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === section?.SECTION_ID && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3  px-5 py-2 ${videoBarActive === topic.SUBSECTION_ID
                        ? "bg-caribbeangreen-200 font-semibold text-richblack-800"
                        : "hover:bg-richblack-900"
                        } `}
                      key={i}
                      onClick={() => {
                        navigate(`/view-course/${courseEntireData?.COURSE_ID}/section/${section?.SECTION_ID}/sub-section/${topic?.SUBSECTION_ID}`)
                        setVideoBarActive(topic.SUBSECTION_ID)
                        courseViewSidebar && window.innerWidth <= 640 ? dispatch(setCourseViewSidebar(false)) : null;
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?.SUBSECTION_ID)}
                        onChange={() => { }}
                      />
                      {topic.TITLE}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
