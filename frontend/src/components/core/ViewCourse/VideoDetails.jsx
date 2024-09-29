import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast"
// require('dotenv').config();

import "video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { setCourseViewSidebar } from "../../../slices/sidebarSlice";

import IconBtn from "../../common/IconBtn";

import { HiMenuAlt1 } from "react-icons/hi";

const VideoDetails = () => {
  const { COURSE_ID, sectionId, SUBSECTION_ID } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentSectionIndx, setcurrentSectionIndx] = useState(0);
  const [currentSubSectionIndx, setcurrentSubSectionIndx] = useState(0);

  // console.log("courseSectionData", courseSectionData)
  // console.log("courseEntireData", courseEntireData)
  // console.log("completedLectures", completedLectures)

  useEffect(() => {
    (async () => {
      // console.log("Course: ", COURSE_ID, "SECTION: ", sectionId, "SUBSECTION: ", SUBSECTION_ID)
      if (!courseSectionData?.length) return;
      if (!COURSE_ID && !sectionId && !SUBSECTION_ID) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        // console.log("courseSectionData", courseSectionData)
        let filteredData;
        courseSectionData.map((course, ind) => {
          // console.log("section",course)
          filteredData =
            course.SECTION_ID === Number(sectionId) ? course : null;
          setcurrentSectionIndx(ind);
        });
        // console.log("filteredData", filteredData)
        let filteredVideoData;
        filteredData?.subSection?.map((data, ind) => {
          if (data.SUBSECTION_ID === Number(SUBSECTION_ID)) {
            filteredVideoData = data;
            setcurrentSubSectionIndx(ind);
          }
          // console.log("Subsection: ", Number(SUBSECTION_ID), data.SUBSECTION_ID, (data.SUBSECTION_ID === Number(SUBSECTION_ID)))
        });
        // console.log("filteredVideoData = ", filteredVideoData)
        if (filteredVideoData) setVideoData(filteredVideoData);
        setPreviewSource(courseEntireData.THUMBNAIL);
        setVideoEnded(false);

        console.log("currentSectionIndx", currentSectionIndx);
        console.log("currentSubSectionIndx", currentSubSectionIndx);
      }
      // if(process.env.FRONTEND_URL.includes('localhost'))toast.error("Cannot load video as we're running in LocalHost")

    })();
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    currentSectionIndx,
    currentSubSectionIndx,
  ]);

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true;
    } else {
      return false;
    }
  };

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection?.length;

    console.log("no of subsections", noOfSubsections);

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSUBSECTION_ID =
        courseSectionData[currentSectionIndx]?.subSection[
          currentSubSectionIndx + 1
        ].SUBSECTION_ID;

      navigate(
        `/view-course/${COURSE_ID}/section/${sectionId}/sub-section/${nextSUBSECTION_ID}`
      );
    } else {
      const nextSectionId =
        courseSectionData[currentSectionIndx + 1].SECTION_ID;
      const nextSUBSECTION_ID =
        courseSectionData[currentSectionIndx + 1].subSection[0].SUBSECTION_ID;
      navigate(
        `/view-course/${COURSE_ID}/section/${nextSectionId}/sub-section/${nextSUBSECTION_ID}`
      );
    }
  };

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const noOfSubsections =
      courseSectionData[currentSectionIndx]?.subSection?.length;

    if (
      currentSectionIndx === courseSectionData?.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)
    if (currentSubSectionIndx !== 0) {
      const prevSUBSECTION_ID =
        courseSectionData[currentSectionIndx]?.subSection[
          currentSubSectionIndx - 1
        ].SUBSECTION_ID;
      navigate(
        `/view-course/${COURSE_ID}/section/${sectionId}/sub-section/${prevSUBSECTION_ID}`
      );
    } else {
      const prevSectionId =
        courseSectionData[currentSectionIndx - 1].SECTION_ID;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection?.length;
      const prevSUBSECTION_ID =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ].SUBSECTION_ID;
      navigate(
        `/view-course/${COURSE_ID}/section/${prevSectionId}/sub-section/${prevSUBSECTION_ID}`
      );
    }
  };

  // handle Lecture Completion
  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { COURSE_ID: COURSE_ID, SUBSECTION_ID: SUBSECTION_ID },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(SUBSECTION_ID));
    }
    setLoading(false);
  };

  const { courseViewSidebar } = useSelector((state) => state.sidebar);

  // this will hide course video , title , desc, if sidebar is open in small device
  // for good looking i have try this
  if (courseViewSidebar && window.innerWidth <= 640) return;

  return (
    <div className="flex flex-col gap-5 text-white">
      {/* open - close side bar icons */}
      <div
        className="sm:hidden text-white absolute left-7 top-3 cursor-pointer "
        onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
      >
        {!courseViewSidebar && <HiMenuAlt1 size={33} />}
      </div>
      {console.log("videoData", videoData)}
      <h1 className="mt-4 text-3xl font-semibold">{videoData?.TITLE}</h1>
      <p className="pt-2 pb-6">{videoData?.DESCRIPTION}</p>
      {console.log("Is first video: ", isFirstVideo())}
      {console.log("Is last video: ", isLastVideo())}
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div>
          {/* //FIXME: Youtube is blocked so use something else */}
          {/* <iframe
            width={window.innerWidth/1.4}
            height={window.innerWidth / 1.77}
            src={videoData.VIDEO_URL}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe> */}
          {<Player
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            autoPlay
            onEnded={() => setVideoEnded(true)}
            src={videoData?.VIDEO_URL}
          >
            <BigPlayButton position="center" />
            {videoEnded && (
              <div
                style={{
                  backgroundImage:
                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                }}
                className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
              >
                {!completedLectures.includes(SUBSECTION_ID) && (
                  <IconBtn
                    disabled={loading}
                    onclick={() => handleLectureCompletion()}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                  />
                )}
                <IconBtn
                  disabled={loading}
                  onclick={() => {
                    if (playerRef?.current) {
                      // set the current time of the video to 0
                      playerRef?.current?.seek(0);
                      setVideoEnded(false);
                    }
                  }}
                  text="Rewatch"
                  customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                />

                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                  {!isFirstVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className="blackButton"
                    >
                      Prev
                    </button>
                  )}
                  {!isLastVideo() && (
                    <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className="blackButton"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </Player>}
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
