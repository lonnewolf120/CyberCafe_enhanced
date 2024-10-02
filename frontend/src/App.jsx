import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from "./pages/CourseDetails";
import Catalog from "./pages/Catalog";
import CatalogHome from "./pages/CatalogHome";

import Navbar from "./components/common/Navbar";

import OpenRoute from "./components/core/Auth/OpenRoute";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor";

import Cart from "./components/core/Dashboard/Cart/Cart";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";

import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import ActivityHeatmap from "./pages/ActivityHeatmap.jsx"

import { ACCOUNT_TYPE } from "./utils/constants";

import { HiArrowNarrowUp } from "react-icons/hi";
import CreateCategory from "./components/core/Dashboard/CreateCategory";
import AllStudents from "./components/core/Dashboard/AllStudents";
import AllInstructors from "./components/core/Dashboard/AllInstructors";

//CTF
import Challenges from "./pages/ctf/ChallengesPage.jsx";
import Contests from "./pages/ctf/Contests.jsx";
import Leaderboard from "./pages/ctf/leaderboard.jsx";
import AddContestPage from "./pages/ctf/AddContestPage.jsx";
import AddChallenge from "./pages/ctf/AddChallenge.jsx"
import StatsDashboard from "./components/core/Dashboard/Stats/StatsDashboard.jsx";

import Terminal from "./pages/Terminal"
//for transition animation
import { motion, AnimatePresence } from "framer-motion";  

function App() {
  const { user } = useSelector((state) => state.profile);
  const [showLogo, setShowLogo] = useState(true);
  // Scroll to the top of the page when the component mounts
  const location = useLocation();

  useEffect(() => {
    // Show logo for 2 seconds, then fade out
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false);

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true);
    } else setShowArrow(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleArrow);
    return () => {
      window.removeEventListener("scroll", handleArrow);
    };
  }, [showArrow]);

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-richblack-900 z-50"
          >
            <h1 className="text-4xl font-bold text-white">Your Logo</h1>
          </motion.div>
        )}
      </AnimatePresence>  */}
      <Navbar />

      {/* go upward arrow */}
      <button
        onClick={() => window.scrollTo(0, 0)}
        className={`bg-blue-100 hover:bg-blue-200 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
          showArrow ? "bottom-6" : "-bottom-24"
        } `}
      >
        <HiArrowNarrowUp />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          // key={location.pathname}
          // initial="initial"
          // animate="in"
          // exit="out"
          // variants={pageVariants}
          // transition={pageTransition}
        >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ABOUT" element={<About />} />
          <Route path="/catalog/" element={<CatalogHome />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:COURSE_ID" element={<CourseDetails />} />

          {/* Open Route - for Only Non Logged in User */}
          <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="verify-EMAIL"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          {/* Protected Route - for Only Logged in User */}
          {/* Dashboard */}
          <Route
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/Settings" element={<Settings />} />
            <Route path="dashboard/Activity" element={<ActivityHeatmap />} />
            <Route path="dashboard/Stats" element={<StatsDashboard />} />

            {/* Route only for Admin */}
            {/* create category, all students, all instructors */}
            {user?.ACCOUNT_TYPE === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route
                  path="dashboard/create-category"
                  element={<CreateCategory />}
                />
                <Route path="dashboard/all-students" element={<AllStudents />} />
                <Route
                  path="dashboard/all-instructors"
                  element={<AllInstructors />}
                />
              </>
            )}

            {/* Route only for Students */}
            {/* cart , EnrolledCourses */}
            {user?.ACCOUNT_TYPE === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
              </>
            )}

            {/* Route only for Instructors */}
            {/* add course , MyCourses, EditCourse*/}
            {user?.ACCOUNT_TYPE === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/edit-course/:COURSE_ID"
                  element={<EditCourse />}
                />
              </>
            )}
          </Route>

          {/* For the watching course lectures */}
          <Route
            element={
              <ProtectedRoute>
                <ViewCourse />
              </ProtectedRoute>
            }
          >
            {user?.ACCOUNT_TYPE === ACCOUNT_TYPE.STUDENT && (
              <Route
                path="view-course/:COURSE_ID/section/:sectionId/sub-section/:SUBSECTION_ID"
                element={<VideoDetails />}
              />
            )}
          </Route>
          
          {/* CTF part */}
          {/*  changes made by Sadman */}
          <Route
            path="/add-contest"
            element={
              <ProtectedRoute>
                <AddContestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contests/all"
            element={
              <ProtectedRoute>
                <Contests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emulator/terminal"
            element={
              <ProtectedRoute>
                <Terminal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard/:cid"
            element={
              <ProtectedRoute>
                <Leaderboard/>
              </ProtectedRoute>
            }
          />
          
          {/* <Route
            path="/cryptography"
            element={
              <ProtectedRoute>
                <WebExploitation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reverse-engineering"
            element={
              <ProtectedRoute>
                <WebExploitation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forensics"
            element={
              <ProtectedRoute>
                <WebExploitation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solutions"
            element={
              <ProtectedRoute>
                <Solutions />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/challenges/:contestID"
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:contestID/add-challenge"
            element={
              <ProtectedRoute>
                <AddChallenge />
              </ProtectedRoute>
            }
          />

          {/*  changes made by Sadman */}

          {/* Page Not Found (404 Page ) */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
