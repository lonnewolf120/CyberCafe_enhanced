import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";

import { getAllInstructorDetails } from "../../../services/operations/adminApi";

import IconBtn from "../../common/IconBtn";




// loading skeleton
const LoadingSkeleton = () => {
  return (<div className="flex p-5 flex-col gap-6 border-b border-2 border-b-richblack-500">
    <div className="flex flex-col sm:flex-row gap-5 items-center mt-7">
      <p className='h-[150px] w-[150px] rounded-full skeleton'></p>
      <div className="flex flex-col gap-2 ">
        <p className='h-4 w-[160px] rounded-xl skeleton'></p>
        <p className='h-4 w-[270px] rounded-xl skeleton'></p>
        <p className='h-4 w-[100px] rounded-xl skeleton'></p>
      </div>
    </div>
    <div className='flex gap-5'>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
      <p className="h-7 w-full sm:w-1/2 rounded-xl skeleton"></p>
    </div>
  </div>)
}


function AllInstructors() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [allInstructorDetails, setAllInstructorDetails] = useState([]);
  const [instructorsCount, setInstructorsCount] = useState();
  const [loading, setLoading] = useState(false)
  // const [instrCourses, setInstrCourses] = useState({})
  let instrCourses=[];


  useEffect(() => {
    const fetchInstructorsData = async () => {
      setLoading(true)
      const resultDB = await getAllInstructorDetails(token);
      console.log("result (fetchInstructors): ", resultDB.data)
      const { allInstructorsDetails, instructorsCount } = resultDB;
      
      
      allInstructorDetails?.map((data) => {
        instrCourses[data.USER_ID] = {
          COURSE_NAME: data.COURSE_NAME,
          COURSE_DESCRIPTION : data.COURSE_DESCRIPTION,
          PRICE: data.PRICE
        }
      });

      console.log("All instructors: ", allInstructorDetails, "Instructor count: ", instructorsCount)
      if (allInstructorsDetails) {
        setAllInstructorDetails(allInstructorsDetails);
        setInstructorsCount(instructorsCount)
      }
      setLoading(false)
    };

    fetchInstructorsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mb-14 flex items-center justify-between text-white">
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">All Instructors Details</h1>

        <IconBtn text="Add Instructor" onclick={() => navigate("")}>
          <VscAdd />
        </IconBtn>
      </div>

      <Table className="rounded-xl border-2 border-richblack-500 ">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-500 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Instructors : {instructorsCount}
            </Th>

            <Th className=" ml-4 text-sm font-medium uppercase text-richblack-100">
              Status
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            loading ? <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
              // if No Data Available
              :
              !allInstructorDetails ? <div className='text-5xl py-5 bg-caribbeangreen-800 text-white text-center'>No Data Available</div>
                :
                allInstructorDetails?.map((instructor) => (
                  <div
                    key={instructor.USER_ID}
                    className='border-x border-2 border-richblack-500 '
                  >
                    <Tr className="flex gap-x-10 px-6 py-8">
                      <Td className="flex flex-1 gap-x-2">
                        <img
                          src={instructor.IMAGE}
                          alt="student"
                          className="h-[150px] w-[150px] rounded-full "
                        />
                        <div className="flex flex-col justify-between">
                          <p className="text-lg font-semibold text-richblack-5">
                            <div className='text-sm font-normal'>
                              <p className='text-base font-bold capitalize'>{instructor.FIRST_NAME + " " + instructor.LAST_NAME}</p>
                              <p>{instructor.EMAIL}</p>

                              <p>
                                Gender:{" "}
                                {instructor.GENDER
                                    ? instructor.GENDER
                                  : "Not define"}
                              </p>
                              <p>
                                Mobile No:{" "}
                                {instructor.CONTACT_NUMBER
                                  ? instructor.CONTACT_NUMBER
                                  : "No Data"}
                              </p>
                              <p>
                                DOB:{" "}
                                {instructor.DATE_OF_BIRTH
                                  ? instructor.DATE_OF_BIRTH
                                  : "No Data"}
                              </p>
                            </div>
                          </p>
                        </div>
                      </Td>
                      <Td className="mr-[11.5%] text-sm font-medium text-richblack-100">
                        {instructor.ACTIVE ? "Active" : "Inactive"}
                      </Td>
                      <Td className="mr-[8%] text-sm font-medium text-richblack-100">
                        {instructor.APPROVED ? "Approved" : "Not Approved"}
                      </Td>
                    </Tr>

                    {// {instrCourses && instrCourses?.length ? (
                    //   <Tr className="flex gap-x-10 px-6 pb-5">
                    //     <p className="text-caribbeangreen-50 ">Built Courses</p>
                    //     <div className='grid grid-cols-5 gap-y-5'>
                    //       {allInstructorDetails.map((course) => (
                    //         (course.USER_ID === instructor.USER_ID)?(
                    //         <div className="text-white text-sm" key={course.COURSE_ID}>
                    //           <p>{course.COURSE_NAME}</p>
                    //           <p className="text-sm font-normal">PRICE: ৳{course.PRICE}</p>
                    //         </div>) : 
                    //         (<div>
                    //         {/* <p>No courses created by Instructor yet</p> */}
                    //       </div>)
                    //       ))}
                    //     </div>
                    //   </Tr>)
                    //   :
                    //   <div className="px-6 text-white mb-4">Not Purchased any course</div>
                    // }
                    }
                  </div>

                ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default AllInstructors;