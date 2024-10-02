import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Robot/Prefer not to say"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-6 sm:px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="FIRST_NAME" className="lable-style">
                First Name
              </label>
              <input
                type="text"
                name="FIRST_NAME"
                id="FIRST_NAME"
                placeholder="Enter first name"
                className="form-style"
                {...register("FIRST_NAME", { required: true })}
                defaultValue={user?.FIRST_NAME}
              />
              {errors.FIRST_NAME && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  Please enter your first name.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="LAST_NAME" className="lable-style">
                Last Name
              </label>
              <input
                type="text"
                name="LAST_NAME"
                id="LAST_NAME"
                placeholder="Enter first name"
                className="form-style"
                {...register("LAST_NAME", { required: true })}
                defaultValue={user?.LAST_NAME}
              />
              {errors.LAST_NAME && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="DATE_OF_BIRTH" className="lable-style">
                Date of Birth
              </label>
              <input
                type="date"
                name="DATE_OF_BIRTH"
                id="DATE_OF_BIRTH"
                className="form-style"
                {...register("DATE_OF_BIRTH", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString()?.split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.DATE_OF_BIRTH}
              />
              {errors.DATE_OF_BIRTH && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  {errors.DATE_OF_BIRTH.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="GENDER" className="lable-style">
                Gender
              </label>
              <select
                type="text"
                name="GENDER"
                id="GENDER"
                className="form-style"
                {...register("GENDER", { required: true })}
                defaultValue={user?.GENDER}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.GENDER && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  Please enter your Gender.
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="CONTACT_NUMBER" className="lable-style">
                Contact Number
              </label>
              <input
                type="tel"
                name="CONTACT_NUMBER"
                id="CONTACT_NUMBER"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register("CONTACT_NUMBER", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 15, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.CONTACT_NUMBER}
              />
              {errors.CONTACT_NUMBER && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  {errors.CONTACT_NUMBER.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="ABOUT" className="lable-style">
                About
              </label>
              <input
                type="text"
                name="ABOUT"
                id="ABOUT"
                placeholder="Enter Bio Details"
                className="form-style"
                {...register("ABOUT", { required: true })}
                defaultValue={user?.ABOUT}
              />
              {errors.ABOUT && (
                <span className="-mt-1 text-[12px] text-caribbeangreen-100">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => { navigate("/dashboard/my-profile") }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>

      </form>
    </>
  )
}