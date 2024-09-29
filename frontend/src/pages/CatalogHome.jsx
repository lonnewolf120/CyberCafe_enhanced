import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";
import { Link } from "react-router-dom";

function Catalog() {
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(`http://localhost:5000/api/v1/course/getAllCourses`);
        setCatalogPageData(result?.data?.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }

  if (!loading && !catalogPageData) {
    return (
      <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
        No Courses found for selected Category
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="box-content bg-richblack-900 px-4 mt-10 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {catalogPageData && catalogPageData?.map((course, i) => (
            <Link to={`/courses/${course.COURSE_ID}`} key={i}>
              <div className="bg-richblack-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
                <img src={course?.THUMBNAIL} alt={course.COURSE_NAME} className="w-full h-32 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold line-clamp-2" style={{ color: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}>{course?.COURSE_NAME}</h3>
                  <p className="text-sm text-richblack-200 line-clamp-3">{course?.COURSE_DESCRIPTION}</p>
                  <p className="text-sm text-richblack-200">Sold: {course?.SOLD}</p>
                  <p className="text-sm text-richblack-200">Rating: {course?.RATING}</p>
                  <div className="flex items-center mt-2">
                    <img src={course?.IMAGE} alt={`${course?.FIRST_NAME} ${course?.LAST_NAME}`} className="w-8 h-8 rounded-full mr-2" />
                    <p className="text-sm text-richblack-200">{course?.FIRST_NAME} {course?.LAST_NAME}</p>
                  </div>
                  <p className="text-lg text-white font-semibold mt-2">${course?.PRICE}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
