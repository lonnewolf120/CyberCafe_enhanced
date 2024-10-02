import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep, } from "../../../../../slices/courseSlice"

import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"




export default function CourseBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors }, } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null) // stored section ID

  console.log("course in CourseBuilder: ", course)
  // handle form submission
  const onSubmit = async (data) => {
    console.log("sent data ", data)
    setLoading(true)

    let result;

    if (editSectionName) {
      result = await updateSection({ SECTION_NAME: data.SECTION_NAME, sectionId: editSectionName, COURSE_ID: course?.data?.COURSE_ID, }, token)
      console.log("editSection res = ", result)
    } else {
      result = await createSection(
        { SECTION_NAME: data.SECTION_NAME, COURSE_ID: course?.data?.COURSE_ID}, token)
    }
    // console.log("section result = ", result)
    if (result) {
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("SECTION_NAME", "")
    }
    setLoading(false)
  }

  // cancel edit
  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("SECTION_NAME", "")
  }

  // Change Edit SECTION_NAME
  const handleChangeEditSectionName = (sectionId, SECTION_NAME) => {
    //FIXME: probably section_name would be here
    if (editSectionName === SECTION_NAME ) {
      cancelEdit()
      return
    }
    setEditSectionName(SECTION_NAME)
    setValue("SECTION_NAME", SECTION_NAME)
  }

  // go To Next
  const goToNext = () => {
    // if (course?.data?.courseContent.length === 0) {
    //   toast.error("Please add atleast one section")
    //   return;
    // }
    // if (course?.data?.courseContent.some((section) => section.subSection.length === 0)) {
    //   toast.error("Please add atleast one lecture in each section")
    //   return;
    // }

    // all set go ahead
    dispatch(setStep(3))
  }

  // go Back
  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Section Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="SECTION_NAME">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="SECTION_NAME"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("SECTION_NAME", { required: true })}
            className="form-style w-full"
          />
          {errors.SECTION_NAME && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        {/* Edit Section Name OR Create Section */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-caribbeangreen-50" />
          </IconBtn>
          {/* if editSectionName mode is on */}
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* nesetd view of section - subSection */}
      {/* {course?.data?.courseContent.length > 0 && ( */}
      {console.log("Course in Course builder:" ,course)}
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      {/* )} */}

      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>

        {/* Next button */}
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}