import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  // console.log("Course: ",course)
  console.log("edit course: ", editCourse, "Course ID: ", course?.COURSE_ID)
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories();
      console.log("Data: ", categories)
      if (categories?.courses?.length > 0) {
        // console.log("categories (course information form): ", categories.data)
        setCourseCategories(categories.data)
      }
      setLoading(false)
    }

    // if form is in edit mode 
    // It will add value in input field
    if (editCourse) {
      // console.log
      console.log("Course data: ", course)
      setValue("courseID", course.COURSE_ID) /// NO COURSE_ID IN COURSE OBJECT
      setValue("courseTitle", course.COURSE_NAME)
      setValue("courseShortDesc", course.COURSE_DESCRIPTION)
      setValue("coursePRICE", course.PRICE)
      setValue("courseTags", course.TAG)
      setValue("courseBenefits", course.WHAT_YOU_WILL_LEARN)
      setValue("courseCategory", course.NAME)
      setValue("courseRequirements", course.INSTRUCTIONS)
      setValue("courseImage", course.THUMBNAIL? course.THUMBNAIL :"/hacking.png")
    }

    getCategories()
  }, [])



  const isFormUpdated = () => {
    const currentValues = getValues()
    console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.COURSE_NAME ||
      currentValues.courseShortDesc !== course.COURSE_DESCRIPTION ||
      currentValues.coursePRICE !== course.PRICE ||
      currentValues.courseTags !== course.TAG ||
      currentValues.courseBenefits !== course.WHAT_YOU_WILL_LEARN ||
      currentValues.courseCATEGORY_ID !== course.CATEGORY_ID ||
      currentValues.courseRequirements !== course.INSTRUCTIONS ||
      currentValues.courseImage !== course.THUMBNAIL) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        data.COURSE_ID = course[0].COURSE_ID;
        console.log('data -> ',data)
        console.log("COURSE DATA HERE: ", course)
        formData.append("COURSE_ID", course[0].COURSE_ID)
        // formData.append("courseId", course[0].COURSE_ID)
        if (currentValues.courseTitle !== course.COURSE_NAME) {
          formData.append("COURSE_NAME", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.COURSE_DESCRIPTION) {
          formData.append("COURSE_DESCRIPTION", data.courseShortDesc)
        }
        if (currentValues.coursePRICE !== course.PRICE) {
          formData.append("PRICE", data.coursePRICE)
        }
        if (currentValues.courseTags !== course.TAG) {
          formData.append("tag", JSON.stringify(data.courseTags?data.courseTags: 'Default' ))
          console.log("tag", JSON.stringify(data.courseTags))
          // formData.append("tag", data.courseTags)
        }
        if (currentValues.courseBenefits !== course.WHAT_YOU_WILL_LEARN) {
          formData.append("WHAT_YOU_WILL_LEARN", data.courseBenefits)
        }
        if (currentValues.courseCATEGORY_ID !== course.CATEGORY_ID) {
          formData.append("category", data.courseCategory)
        }
        if (currentValues.courseRequirements !== course.INSTRUCTIONS) {
          formData.append("INSTRUCTIONS", JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.THUMBNAIL) {
          formData.append("THUMBNAIL", data.courseImage?data.courseImage: "/hacking.png")
        }
        //FIXME
        // dispatch(setEditCourse(true))
        // send data to backend
        setLoading(true)
        // console.log("FORM DATA: ", formData.getAll())
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    // user has visted first time to step 1 
    const formData = new FormData()
    console.log("The formData: ", formData)
    formData.append("COURSE_NAME", data.courseTitle)
    formData.append("COURSE_DESCRIPTION", data.courseShortDesc)
    formData.append("PRICE", data.coursePRICE)
    formData.append("tag", JSON.stringify(data.courseTags? data.courseTags: 'Default'))
    formData.append("WHAT_YOU_WILL_LEARN", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("INSTRUCTIONS", JSON.stringify(data.courseRequirements))
    formData.append("THUMBNAIL", data.courseImage?data.courseImage: "/hacking.png")
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full ] "
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course PRICE */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePRICE">
          Course PRICE <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePRICE"
            placeholder="Enter Course PRICE"
            {...register("coursePRICE", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"

          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePRICE && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course PRICE is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2 ">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full cursor-pointer"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?.CATEGORY_ID}>
                {category?.NAME}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      {/* FIXME: ChipInput not working */}
      {/* <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter or Comma"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse? course?.TAG : 'Default'}
      /> */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTags">
          Tags <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTags"
          placeholder="Enter Course Tag"
          {...register("courseTags", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course tags is required
          </span>
        )}
      </div>

      {/* Course THUMBNAIL Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.THUMBNAIL : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/INSTRUCTIONS */}
      {/* <RequirementsField
        name="courseRequirements"
        label="Requirements/INSTRUCTIONS"
        register={register}
        setValue={setValue}
        errors={errors}
      /> */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseRequirements">
          Requirements/Instructions <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseRequirements"
          placeholder="Enter Course Tag"
          {...register("courseRequirements", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Requirements is required
          </span>
        )}
      </div>

      {/* Next Button */}
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
              text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
          >
            Continue Without Saving
          </button>
        )}
        <button type="submit" disabled={loading} className="flex items-center gap-x-2">
          <IconBtn text={!editCourse ? "Next" : "Save Changes"}>
            <MdNavigateNext />
          </IconBtn>
        </button>
      </div>
    </form>
  )
}


