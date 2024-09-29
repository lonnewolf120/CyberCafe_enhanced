const { addSubsection, findSubsection, updateSubsection, deleteSubsection } = require('../database/origins/CourseSections');
// const Section = require('../models/section');
// const SubSection = require('../models/subSection');
const { uploadImageToCloudinary } = require('../utils/imageUploader');



// ================ create SubSection ================
exports.createSubSection = async (req, res) => {
    try {
        // extract data
        const { title, description, sectionId } = req.body;

        // extract video file
        const videoFile = req.files.video
        // console.log('videoFile ', videoFile)

        // validation
        if (!title || !description || !videoFile || !sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // upload video to cloudinary
        const videoFileDetails = await uploadImageToCloudinary(videoFile, process.env.CLOUDINARY_FOLDER_NAME);

        // TODO: create entry in DB
        const SubSectionDetails = await addSubsection(title, videoFileDetails.duration, description, videoFileDetails.secure_url, sectionId)

        // return response
        res.status(200).json({
            success: true,
            data: SubSectionDetails,
            message: 'SubSection created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating SubSection');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating SubSection'
        })
    }
}



// ================ Update SubSection ================
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, SUBSECTION_ID, title, description } = req.body;

        // validation
        if (!SUBSECTION_ID) {
            return res.status(400).json({
                success: false,
                message: 'subSection ID is required to update'
            });
        }

        // if (!subSection) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "SubSection not found",
        //     })
        // }
        let subSection={id: SUBSECTION_ID}

        // add data
        if (title) {
            subSection.title = title;
        }

        if (description) {
            subSection.description = description;
        }

        // upload video to cloudinary
        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.CLOUDINARY_FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = uploadDetails.duration;
        }

        const updatedSection = await 
        updateSubsection(subSection)

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        console.error('Error while updating the section')
        console.error(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating the section",
        })
    }
}



// ================ Delete SubSection ================
exports.deleteSubSection = async (req, res) => {
    try {
        const { SUBSECTION_ID, sectionId } = req.body
        // delete from DB
        const subSection = await deleteSubsection(SUBSECTION_ID, sectionId)

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        // const updatedSection = await Section.findById(sectionId).populate('subSection')

        // In frontned we have to take care - when subsection is deleted we are sending ,
        // only section data not full course details as we do in others 

        // success response
        return res.json({
            success: true,
            // data: updatedSection,
            data: subSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,

            error: error.message,
            message: "An error occurred while deleting the SubSection",
        })
    }
}