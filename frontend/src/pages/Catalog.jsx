import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/common/Footer";
import Course_Card from "../components/core/Catalog/Course_Card";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import Loading from "./../components/common/Loading";

import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { fetchCourseCategories } from "./../services/operations/courseDetailsAPI";
import { set } from "react-hook-form";
import { useSelector } from "react-redux";

function Catalog() {
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  // const { catalogCourse } = useSelector((state) => state.catalog)
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("categoryId: ", categoryId);
  //FIXME: security issue: We're fetching all the course data using the fetchCourseCategories function, we gotta change that
  useEffect(() => {
    (async () => {
      try {
        // console.log("catalog name:", catalogName)
        const result = await fetchCourseCategories();
        // console.log("courses: ", result);
        // for(let i=0; i < )
        result?.courses?.map((ct, ind) => {
          if (ct.CAT_NAME === catalogName) {
            // console.log("Matched category: ", ct, catalogName);
            setCategoryId(ct.CATEGORY_ID);
          }
        });
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
    })();
  }, [catalogName]);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        setLoading(true);
        try {
          const res = await getCatalogPageData(categoryId);
          console.log("from catalog.jsx, getCatalogPageData: ", res);
          setCatalogPageData(res);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  // console.log('======================================= ', catalogPageData)
  // console.log('categoryId ==================================== ', categoryId)

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

  //FIXME: If we select a category, then show all courses under that category
  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        {catalogPageData?.selectedCategory?.slice(0,3)?.map((course, i) => {
          <div className="mx-auto flex min-h-[300px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `}
              <span className="text-caribbeangreen-25">
                {course?.COURSE_NAME}
              </span>
            </p>
            <p className="text-3xl text-richblack-5">
              {course?.COURSE_NAME}
            </p>
            <p className="max-w-[870px] text-richblack-200">
              {course?.COURSE_DESCRIPTION}
            </p>
          </div>;
        })}
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-caribbeangreen-25 text-caribbeangreen-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-caribbeangreen-25 text-caribbeangreen-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div className="py-8">
          {/* {console.log("catalogPageData?.selectedCategory: ", catalogPageData)} */}
          {catalogPageData?.selectedCategory ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.selectedCategory
                ?.slice(0, 2)
                .map((courseCatalog, i) => (
                  // console.log(`Get started course ${i}: `, courseCatalog),
                  <Course_Card
                    course={courseCatalog}
                    key={courseCatalog.COURSE_ID}
                    Height={"h-[300px]"}
                  />
                ))}
            </div>
          ) : (
            <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
              No Courses found for selected Category
              {setLoading(true)}
            </div>
          )}
        </div>
      </div>

      {/* Section 2 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses : {/*catalogPageData?.categoriesExceptSelected?.name*/}
        </div>
        <div className="py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* {console.log("catalogPageData?.categoriesExceptSelected: ", catalogPageData?.categoriesExceptSelected)}
        {console.log("catalogPageData?.categoriesExceptSelected: ", catalogPageData)} */}
          {catalogPageData?.categoriesExceptSelected
              ?.slice(0, 4)
              .map((courseCatalog, i) => (
                // console.log(`Top course ${i}: `, courseCatalog),
                <Course_Card
                  course={courseCatalog}
                  key={courseCatalog.COURSE_ID}
                  Height={"h-[300px]"}
                />
              ))}
          </div>
          </div>
       </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {catalogPageData?.mostSellingCourses
              ?.slice(0, 4)
              .map((courseCatalog, i) => (
                // console.log(`Frequently bought course ${i}: `, courseCatalog),
                <Course_Card
                  course={courseCatalog}
                  key={courseCatalog.COURSE_ID}
                  Height={"h-[300px]"}
                />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Catalog;
