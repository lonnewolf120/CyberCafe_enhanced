const { getStudentsEnrolled } = require('../database/origins/CourseDB');
const { getRating, addRating, getAvgRating, getAllRR } = require('../database/origins/rating');

// ================ Create Rating ================
exports.createRating = async (req, res) => {
    try {
        // TODO: replace with PL/SQL
        console.log("req.body (createRating:", req.body);
        const { rating, review, COURSE_ID } = req.body;

        const USER_ID = req.user.id;

        // validation
        if (!rating || !review || !COURSE_ID) {
            return res.status(401).json({
                success: false,
                message: "All fileds are required"
            });
        }

        // check user is enrollded in course ?
        const courseDetails = await getStudentsEnrolled(COURSE_ID, USER_ID);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course'
            });
        }


        // check user already reviewd ?
        const alreadyReviewd = await getRating(COURSE_ID, USER_ID);

        if (alreadyReviewd) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user'
            });
        }

        // TODO: create entry in DB
        const ratingReview = await addRating(
        USER_ID, COURSE_ID, rating, review
        );


        // TODO: link this rating to course 
        // const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: COURSE_ID },
        //     {
        //         $push: {
        //             ratingAndReviews: ratingReview._id
        //         }
        //     },
        //     { new: true })


        // console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success: true,
            data:ratingReview,
            message: "Rating and Review created Successfully",
        })
    }
    catch (error) {
        console.log('Error while creating rating and review');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating rating and review',
        })
    }
}




// ================ Get Average Rating ================
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const COURSE_ID = req.body.COURSE_ID;
            
            //TODO: calculate avg rating

            const result = await getAvgRating(COURSE_ID);

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}





// ================ Get All Rating And Reviews ================
exports.getAllRatingReview = async(req, res)=>{
    try{
        const allReviews = await getAllRR();

        return res.status(200).json({
            success:true,
            data:allReviews,
            message:"All reviews fetched successfully"
        });
    }
    catch(error){
        console.log('Error while fetching all ratings');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching all ratings',
        })
    }
}
