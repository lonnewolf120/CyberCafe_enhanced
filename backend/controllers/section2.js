const { addSection, updateSection, deleteSection } = require('../database/origins/CourseSections');

// ================ create Section ================
exports.createSection = async (req, res) => {
    try {
        // extract data 
        const { SECTION_NAME, COURSE_ID } = req.body;
        console.log("req :",req.body)
        console.log('SECTION_NAME =', SECTION_NAME, ", COURSE_ID = ", COURSE_ID)

        // validation
        if (!SECTION_NAME || !COURSE_ID) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const newSection = await addSection(COURSE_ID, SECTION_NAME);

        //TODO:
        // const updatedCourseDetails = await Course.findById(COURSE_ID)
        //     .populate({
        //         path: 'courseContent',
        //         populate: {
        //             path: 'subSection'
        //         }

        //     })

        // above -- populate remaining 

        res.status(200).json({
            success: true,
            // updatedCourseDetails,
            data: newSection,
            message: 'Section created successfully'
        })
    }

    catch (error) {
        console.log('Error while creating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating section'
        })
    }
}


// ================ update Section ================
exports.updateSection = async (req, res) => {
    try {
        // extract data
        const { SECTION_NAME, sectionId, COURSE_ID } = req.body;

        // validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const upd = await updateSection(SECTION_NAME, sectionId);

        // TODO: update section name in DB
        // const updatedCourseDetails = await Course.findById(COURSE_ID)
        //     .populate({
        //         path: 'courseContent',
        //         populate: {
        //             path: 'subSection'
        //         }
        //     })

        res.status(200).json({
            success: true,
            // data:updatedCourseDetails,
            data: upd,
            message: 'Section updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }
}



// ================ Delete Section ================
exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, COURSE_ID } = req.body;
        // console.log('sectionId = ', sectionId);

        // TODO: delete section by id from DB
        const delinfo = await deleteSection(sectionId);

        // const updatedCourseDetails = await Course.findById(COURSE_ID)
        //     .populate({
        //         path: 'courseContent',
        //         populate: {
        //             path: 'subSection'
        //         }
        //     })

        res.status(200).json({
            success: true,
            // data: updatedCourseDetails,
            data: delinfo,
            message: 'Section deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while deleting section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting section'
        })
    }
}

