import React, { useEffect, useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Img from './../../common/Img';
import { getEnrolledStudents } from "../../../services/operations/courseDetailsAPI"


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [enrolledStudents, setEnrolledStudent] = useState([])
  console.log("Course data (CourseDetailsCard.jsx):", course[0])
  const {
    THUMBNAIL,
    PRICE,
    COURSE_ID,
  } = course[0]

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.ACCOUNT_TYPE === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      console.log("course being added in cart: ", course[0])
      dispatch(addToCart(course[0]))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }
  async function getStudents(){
    const reslt = await getEnrolledStudents(course[0].COURSE_ID, token)
    console.log("The result: ", reslt)
    setEnrolledStudent(reslt?.data)
    console.log("Students enrolled: ", enrolledStudents)
  }
  useEffect(()=>{
    getStudents()
    },[])
  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5 `}
      >
        {/* Course Image */}
        <Img
          src={course[0].THUMBNAIL}
          alt={course[0]?.COURSE_NAME}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Tk. {PRICE}
          </div>
          <div className="flex flex-col gap-4">
            {/* TODO: insert all students enrolled into course[0], then replace onClick (of below button) with:
            onClick={
                user && course?.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            */}
            <button
              className="caribbeangreenButton outline-none"
              onClick={
                handleBuyCourse
              }
            >
              {/* TODO: replace below code with this after adding students enrolled into course[0]: 
              {user && course?.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
                */}
              Buy Now
            </button>
            {/*TODO: also replace the following code with this code after adding students enrolled into course[0]:*/} 
            {(!user || !course?.includes(user?.USER_ID)) && (
              <button onClick={handleAddToCart} className="blackButton outline-none">
                Add to Cart
              </button>
            )}
          </div>

          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Day Money-Back Guarantee
          </p>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              Course Requirements :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {/* <p>{course?.INSTRUCTIONS}</p> */}
              {course?.INSTRUCTIONS?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-caribbeangreen-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard