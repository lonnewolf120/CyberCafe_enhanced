// const Category = require('../models/category')
const {addCategory, showAllCat, showAllCourses, showCatWithCourse,showCatWithCoursePL, getMostSellingCourses, deleteCategory, showCourseForCat, showAllCat2} = require("../database/origins/Cat.js")


// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;
``
        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await addCategory(name, description);
        console.log(categoryDetails);

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ delete Category ================
exports.deleteCategory = async (req, res) => {
    try {
        // extract data
        const { categoryId } = req.body;

        // validation
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'categoryId is required'
            });
        }

        const result = await deleteCategory(categoryId);
        console.log("Deleted cat, result: ", result)

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.log('Error while deleting Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while deleting Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await showAllCat2();
        // console.log("ALL CATEGORIES from backend: ", allCategories);


        // return response
        res.status(200).json({
            success: true,
            data: allCategories.categories,
            courses: allCategories.courses,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}

// exports.getCoursesOfCategory = async (req, res) => {
// try{
//     //FIXME: no req returning
//     const cat_name = req.body;
//     console.log("CAT NAME (getCoursesofCategory): ", req.body, req.params, req.query);
//     const allCourses = await showCourseForCat(cat_name);
//     console.log("ALL COURSES (FROM DB): ", allCourses)
//     res.status(200).json({
//         success: true,
//         data: allCourses,
//         message: 'All courses for category fetched successfully'
//     })
// }

//     catch (error) {
//         console.log('Error while fetching all courses for Category');
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: 'Error while fetching all courses for Category'
//         })
//     }

// }

// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("PRINTING CATEGORY ID: (getCategoryPageDetails)", categoryId);

        // Get courses for the specified category
        const selectedCategory = await showCatWithCourse(categoryId);
        console.log("SELECTED COURSE (from category.js):", selectedCategory);

        // console.log('selectedCategory = ', selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
            // console.log("Category not found.")
            return res.status(404).json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        // if (selectedCategory.length === 0) {
        //     console.log("No courses found for the selected category.")
        //     return res.status(404).json({
        //         success: false,
        //         data: null,
        //         message: "No courses found for the selected category.",
        //     })
        // }

        // Get courses for other categories
        const categoriesExceptSelected = await showCatWithCourse(categoryId, 0)
      
        const mostSellingCourses = await getMostSellingCourses({fetchAtmost:5});

        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                categoriesExceptSelected,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.getAllCourses = async (req, res) =>{
    try {
        const courses = await showAllCourses();
        console.log("ALL COURSES: ", courses)
        res.status(200).json({
            success: true,
            data: courses,
            message: 'All courses fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all courses');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all courses'
        })
    }
}