import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"

import { addToCart, removeFromCart } from "../../../../slices/cartSlice"
import Img from './../../../common/Img';
import { useEffect } from "react"

export default function RenderCartCourses() {
  let { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  useEffect(() => {},[cart])

  {/* FIXME: this is not valid fully may give uncertain error, have to update cart (state) in a proper way, 
  the courses fetched using fetchCoruseCategories() maybe responsible or how we pass those courses */}
  // if((typeof cart[0]) === 'object') {
  //   console.log("cart: ",cart[0]);
  //   cart = cart[0]
  //   dispatch(removeFromCart(cart.COURSE_ID))
  //   dispatch(addToCart(cart))
  // }
  useEffect(() => {},[cart])

  return (
    <div className="flex flex-1 flex-col">
      {/* {console.log("CART: ", cart, "type: ", typeof cart[0])} */}
      {cart?.map((course, indx) => (
        console.log("course", course),
        <div
          key={course.COURSE_ID}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
            } ${indx !== 0 && "mt-6"} `}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            {/* course THUMBNAIL */}
            <Img
              src={course?.THUMBNAIL}
              alt={course?.COURSE_NAME}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />

            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.COURSE_NAME}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-caribbeangreen-5">4.5</span>
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-richblack-400">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => dispatch(removeFromCart(course.COURSE_ID))}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-caribbeangreen-100">
              ৳ {course?.PRICE}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}