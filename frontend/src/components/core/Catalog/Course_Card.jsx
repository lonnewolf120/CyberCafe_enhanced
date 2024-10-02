import React, { useEffect, useState } from "react"

// import { Avatar } from "flowbite-react";
// Icons
// import { FaRegStar, FaStar } from "react-icons/fa"
// import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

// import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';



function Course_Card({ course, Height }) {
  console.log("Course data (Course_Card.jsx):", course)
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    // const count = GetAvgRating(course.RATINGS)
    // setAvgReviewCount(course?.ratings.AVG_RATING)
    console.log("rating: ", course?.AVG_RATING)
    setAvgReviewCount(course?.AVG_RATING);
    
  }, [course])
  return (
    <div className='hover:scale-[1.06] flex transition-all duration-200 z-50 '>
      <Link to={`/courses/${course.COURSE_ID}`}>
        <div className=" rounded-lg h-56 flex px-4 py-2">
          {/* {console.log("Course in Course_Card:")} */}
          <div className="rounded-lg p-4">
            <Img
              src={course?.THUMBNAIL}
              alt="course thumnail"
              className={`aspect-square w-48 rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
          <p className="text-xl text-richblack-5">{course?.COURSE_NAME}</p>
          {/* <p className="text-xl text-richblack-5">{course?.CATEGORY_NAME}</p> */}
            <p className="text-sm text-richblack-50">
             Instructors: {course?.INSTRUCTOR_NAME}
            </p>
            <Img
            src={course?.INSTRUCTOR_IMAGE}
            alt={` `}
            className="aspect-square w-[24px] rounded-full object-cover"
             />
            {/* <Avatar>{course?.INSTRUCTOR_IMAGE}</Avatar> */}
            <div className="flex items-center gap-2">
              <span className="text-caribbeangreen-5">{avgReviewCount}</span>
              
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5 content">Tk. {course?.PRICE}</p>
            
            
            
          
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card
