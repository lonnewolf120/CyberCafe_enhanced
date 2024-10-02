import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RiDeleteBin6Line } from "react-icons/ri";

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
}) {
  const { editCourse, course } = useSelector((state) => state.course);
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      console.log(
        "The current course (RequirementsField): ",
        course[0]?.INSTRUCTIONS
      );
      setRequirementsList(course);
    }
    register(
      name,
      { required: true, validate: (value) => value.length > 0 },
      requirementsList[0]?.INSTRUCTIONS
    );
  }, []);

  useEffect(() => {
    setValue(name, requirementsList[0]?.INSTRUCTIONS);
  }, [requirementsList]);

  // add instruction
  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };

  // delete instruction
  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...requirementsList];
    updatedRequirements.splice(index, 1);
    setRequirementsList(updatedRequirements);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-caribbeangreen-50"
        >
          Add
        </button>
      </div>
      {requirementsList && requirementsList?.length > 0 ? (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement?.INSTRUCTIONS}</span>
              {(index!== 0)?
              (
                <button
                  type="button"
                  className="ml-2 text-xs text-grey-300 "
                  onClick={() => handleRemoveRequirement(index)}
                >
                  {/* clear  */}
                  <RiDeleteBin6Line className="text-pink-200 text-sm hover:scale-125 duration-200" />
                </button>
          ):<div></div>}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <span>{requirementsList[0]}</span>
          <button
            type="button"
            className="ml-2 text-xs text-grey-300 "
            onClick={() => handleRemoveRequirement(index)}
          >
            {/* clear  */}
            <RiDeleteBin6Line className="text-pink-200 text-sm hover:scale-125 duration-200" />
          </button>
        </div>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
