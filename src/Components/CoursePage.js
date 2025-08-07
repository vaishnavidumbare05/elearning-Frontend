import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShareAlt, FaBook, FaListAlt, FaLock } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import SoftwareDeveloper from "./SoftwareDeveloper";
import "./CoursePage.css";

const CoursePage = () => {
    const [videos, setVideos] = useState([]);
    const [completedVideos, setCompletedVideos] = useState(0);
    const [totalVideos, setTotalVideos] = useState(0);
    const [activeSection, setActiveSection] = useState("content");
    const [assessmentStatuses, setAssessmentStatuses] = useState({}); // Store assessment statuses
    const [isFifthAssessmentCompleted, setIsFifthAssessmentCompleted] = useState(false); // Check if fifth assessment is completed
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage after login

    // Fetch course data including assessments
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Fetch videos
                const videoResponse = await fetch("http://localhost/backend/api/lessons.php");
                const videoData = await videoResponse.json();

                if (videoData) {
                    setVideos(videoData);
                    const total = videoData.length;
                    const completed = videoData.filter(video => video.status === "completed").length;
                    setTotalVideos(total);
                    setCompletedVideos(completed);
                }

                // Fetch assessment statuses
                const assessmentIds = [1, 2, 3, 4, 5];  // Assumed assessments 1-5
                const statusPromises = assessmentIds.map(async (id) => {
                    const response = await fetch(`http://localhost/backend/routes/assessment_soft_results.php?id=${id}`);
                    const result = await response.json();

                    console.log(`Assessment ${id} Response:`, result); // Debugging response structure

                    // Check if the result has the expected structure
                    if (result.status) {
                        return {
                            id,
                            status: result.status,  // 'completed' or other status
                        };
                    } else {
                        return {
                            id,
                            status: "unknown",  // Handle unexpected responses
                        };
                    }
                });

                // Await all status fetches and set them into state
                const statuses = await Promise.all(statusPromises);
                const statusMap = statuses.reduce((acc, { id, status }) => {
                    acc[id] = { status };  // Store in a mapping by assessment ID
                    return acc;
                }, {});

                setAssessmentStatuses(statusMap);  // Update state with the assessment data
                setIsFifthAssessmentCompleted(statusMap[5]?.status === "completed");  // Track if the fifth assessment is completed
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();  // Initial fetch on component mount
    }, []);  // Dependency array is empty to ensure it runs only once when component mounts

    // Helper function to determine badge and icon based on progress
    const getProgressBadge = (progress) => {
        if (progress <= 33) {
            return {
                badge: "Bronze",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="brown"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="6" x2="12" y2="18" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                    </svg>
                ),
            };
        } else if (progress <= 66) {
            return {
                badge: "Silver",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="silver"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="6" x2="12" y2="18" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                    </svg>
                ),
            };
        } else {
            return {
                badge: "Gold",
                icon: (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="gold"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="6" x2="12" y2="18" />
                        <line x1="6" y1="12" x2="18" y2="12" />
                    </svg>
                ),
            };
        }
    };

    // Calculate the progress percentage
    const progressPercentage = (completedVideos / totalVideos) * 100;

    // Conditional rendering for section toggle
    const toggleSection = (section) => {
        setActiveSection(section);
    };

    // Helper function to check if previous assessments are completed
    const arePreviousAssessmentsCompleted = (assessmentId) => {
        for (let i = 1; i < assessmentId; i++) {
            if (assessmentStatuses[i]?.status !== "completed") {
                return false;
            }
        }
        return true;
    };

    const handleAssessmentCompletion = (assessmentId) => {
        // Update the status of the specific assessment to completed
        setAssessmentStatuses(prevState => ({
            ...prevState,
            [assessmentId]: { status: "completed" },
        }));
    };

    return (
        <div className="container my-5">
            {/* Course Card */}
            <div className="card shadow-sm rounded">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start">
                    {/* Left Section: Image, Title, Progress, and Button */}
                    <div className="d-flex align-items-center w-100 mb-3 mb-md-0">
                        {/* Image */}
                        <img
                            src={require("../img/sw.jpeg")} // Replace with your image path
                            alt="Course Thumbnail"
                            className="img-fluid"
                            style={{
                                height: "150px",
                                maxWidth: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginRight: "15px",
                            }}
                        />
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <h5 className="card-title mb-2">Web Development</h5> {/* Replace with your title */}
                            <p className="text-muted mb-1">In Progress</p> {/* Replace with your status */}
                            {/* Progress Bar */}
                            <div className="progress mb-2" style={{ height: "10px", width: "100%", maxWidth: "200px" }}>
                                <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{ width: `${progressPercentage}%` }} // Replace with your progress percentage
                                    aria-valuenow={progressPercentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div>
                            <small className="text-muted">{progressPercentage}% completed</small> {/* Replace with your progress */}
                            {/* Button */}
                            <div className="mt-2">
                                <button className="btn btn-primary" onClick={() => navigate("/web")}> {/* Replace with your button action */}
                                    Resume
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Badge */}
                    <div className="d-flex align-items-center ms-md-3">
                        <div className="d-flex align-items-center">
                            {/* Badge Icon */}
                            <span className="me-2">
                                {getProgressBadge(progressPercentage).icon} {/* Replace with your badge icon logic */}
                            </span>
                            {/* Badge Text */}
                            <span className="badge text-dark d-flex justify-content-center align-items-center">
                                {getProgressBadge(progressPercentage).badge}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Buttons */}
            <div className="btn-group mt-4 w-100" role="group">
                <button
                    className={`btn ${activeSection === "content" ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => toggleSection("content")}
                >
                    <FaBook className="me-2" /> Content
                </button>
                <button
                    className={`btn ${activeSection === "assessments" ? "btn-dark" : "btn-outline-dark"} `}
                    onClick={() => toggleSection("assessments")}
                >
                    <FaListAlt className="me-2" /> Assessments
                </button>
            </div>

            {/* Content Section */}
            {activeSection === "content" && <SoftwareDeveloper />}

            {/* Assessments Section */}
            {activeSection === "assessments" && (
                <div>
                    <h5>Assessments</h5>
                    <p className="text-muted">Check your progress and complete pending assessments.</p>
                    <ul className="list-group">
                        {[1, 2, 3, 4].map((id) => (
                            <li
                                className="list-group-item d-flex justify-content-between align-items-center py-3"
                                key={id}
                                style={{
                                    pointerEvents: assessmentStatuses[id]?.status === "completed" ? "none" : "auto",
                                    opacity: assessmentStatuses[id]?.status === "completed" ? 0.5 : 1
                                }}
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        src={require("../img/doc.gif")}
                                        alt="Assessment thumbnail"
                                        className="me-2"
                                        style={{ width: "40px", height: "40px" }}
                                    />
                                    <div className="d-flex flex-column">
                                        {assessmentStatuses[id]?.status !== "completed" ? (
                                            <Link
                                                to={`/assessment-soft/${id}`}
                                                className="text-decoration-none text-dark"
                                                onClick={() => handleAssessmentCompletion(id)} // Mark assessment as completed
                                            >
                                                Assessment {id}
                                            </Link>
                                        ) : (
                                            <span className="text-muted">Assessment {id} (Completed)</span>
                                        )}
                                        <span style={{ fontSize: "14px", color: "black" }}>
                                            {assessmentStatuses[id]?.status || "Loading..."}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-none d-md-flex align-items-center">
                                    {assessmentStatuses[id]?.status === "completed" ? (
                                        <span className="badge bg-success rounded-pill">
                                            <FaCheckCircle /> Completed
                                        </span>
                                    ) : (
                                        <span className="badge bg-warning rounded-pill">Pending</span>
                                    )}
                                </div>
                            </li>
                        ))}

                        {/* Fifth assessment, locked until all prior assessments are completed */}
                        <li
                            className="list-group-item d-flex justify-content-between align-items-center py-3"
                            style={!arePreviousAssessmentsCompleted(5) ? { pointerEvents: "none", opacity: "0.5" } : {}}
                            key={5}
                        >
                            <div className="d-flex align-items-center">
                                <img
                                    src={require("../img/doc.gif")}
                                    alt="Assessment 5 thumbnail"
                                    className="me-2"
                                    style={{ width: "40px", height: "40px" }}
                                />
                                <div className="d-flex flex-column">
                                    {assessmentStatuses[5]?.status !== "completed" ? (
                                        <Link to="/assessment-soft/5" className="text-decoration-none text-dark">
                                            Assessment 5
                                        </Link>
                                    ) : (
                                        <span className="text-muted">Assessment 5 (Completed)</span>
                                    )}
                                    <span style={{ fontSize: "14px", color: "black" }}>
                                        {assessmentStatuses[5]?.status || "Loading..."}
                                    </span>
                                </div>
                            </div>
                            <div className="d-none d-md-flex align-items-center">
                                {assessmentStatuses[5]?.status === "completed" ? (
                                    <span className="badge bg-success rounded-pill">
                                        <FaCheckCircle /> Completed
                                    </span>
                                ) : (
                                    <span className="badge bg-warning rounded-pill">Locked</span>
                                )}
                            </div>
                        </li>
                    </ul>

                    {/* Show the certificate button if the fifth assessment is completed */}
                    {isFifthAssessmentCompleted && (
                        <div className="mt-4">
                            <Link to="/new-certificate">
                                <button className="btn btn-success mt-4">Show Certificate</button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CoursePage;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaCheckCircle, FaShareAlt, FaBook, FaListAlt, FaLock } from 'react-icons/fa';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import SoftwareDeveloper from "./SoftwareDeveloper";
// import "./CoursePage.css";

// const CoursePage = () => {
//     const [videos, setVideos] = useState([]);
//     const [completedVideos, setCompletedVideos] = useState(0);
//     const [totalVideos, setTotalVideos] = useState(0);
//     const [activeSection, setActiveSection] = useState("content");
//     const [assessmentStatuses, setAssessmentStatuses] = useState({}); // Store assessment statuses
//     const [isFifthAssessmentCompleted, setIsFifthAssessmentCompleted] = useState(false); // Check if fifth assessment is completed
//     const navigate = useNavigate();
//     const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage after login

//     // Fetch course data including assessments
//     useEffect(() => {
//         const fetchCourseData = async () => {
//             try {
//                 // Fetch videos
//                 const videoResponse = await fetch("http://localhost/backend/api/lessons.php");
//                 const videoData = await videoResponse.json();

//                 if (videoData) {
//                     setVideos(videoData);
//                     const total = videoData.length;
//                     const completed = videoData.filter(video => video.status === "completed").length;
//                     setTotalVideos(total);
//                     setCompletedVideos(completed);
//                 }

//                 // Fetch assessment statuses
//                 const assessmentIds = [1, 2, 3, 4, 5];  // Assumed assessments 1-5
//                 const statusPromises = assessmentIds.map(async (id) => {
//                     const response = await fetch(`http://localhost/backend/routes/assessment_soft_results.php?id=${id}`);
//                     const result = await response.json();

//                     console.log(`Assessment ${id} Response:`, result); // Debugging response structure

//                     // Check if the result has the expected structure
//                     if (result.status) {
//                         return {
//                             id,
//                             status: result.status,  // 'completed' or other status
//                         };
//                     } else {
//                         return {
//                             id,
//                             status: "unknown",  // Handle unexpected responses
//                         };
//                     }
//                 });

//                 // Await all status fetches and set them into state
//                 const statuses = await Promise.all(statusPromises);
//                 const statusMap = statuses.reduce((acc, { id, status }) => {
//                     acc[id] = { status };  // Store in a mapping by assessment ID
//                     return acc;
//                 }, {});

//                 setAssessmentStatuses(statusMap);  // Update state with the assessment data
//                 setIsFifthAssessmentCompleted(statusMap[5]?.status === "completed");  // Track if the fifth assessment is completed
//             } catch (error) {
//                 console.error("Error fetching course data:", error);
//             }
//         };

//         fetchCourseData();  // Initial fetch on component mount
//     }, []);  // Dependency array is empty to ensure it runs only once when component mounts

//     // Conditional rendering for section toggle
//     const toggleSection = (section) => {
//         setActiveSection(section);
//     };

//     // Helper function to check if previous assessments are completed
//     const arePreviousAssessmentsCompleted = (assessmentId) => {
//         for (let i = 1; i < assessmentId; i++) {
//             if (assessmentStatuses[i]?.status !== "completed") {
//                 return false;
//             }
//         }
//         return true;
//     };

//     const handleAssessmentCompletion = (assessmentId) => {
//         // Update the status of the specific assessment to completed
//         setAssessmentStatuses(prevState => ({
//             ...prevState,
//             [assessmentId]: { status: "completed" },
//         }));
//     };

//     // Function to determine badge type based on progress percentage
//     const getProgressBadge = (progressPercentage, option = 'GoldSilverBronze') => {
//         if (option === 'GoldSilverBronze') {
//             if (progressPercentage <= 33) return 'Bronze';
//             if (progressPercentage <= 66) return 'Silver';
//             return 'Gold';
//         } else if (option === 'HardNormalEasy') {
//             if (progressPercentage <= 33) return 'Easy';
//             if (progressPercentage <= 66) return 'Normal';
//             return 'Hard';
//         }
//     };

//     // Calculate the progress percentage
//     const progressPercentage = (completedVideos / totalVideos) * 100;

//     return (
//         <div className="container my-5">
//             {/* Course Card */}
//             <div className="card custom-card shadow-lg rounded">
//                 <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start">
//                     <div className="d-flex align-items-center w-100 mb-3 mb-md-0">
//                         <img
//                             src={require("../img/sw.jpeg")}
//                             alt="Course Thumbnail"
//                             className="img-fluid course-image"
//                         />
//                         <div style={{ flex: 1 }}>
//                             <h5 className="course-title mb-2">Web Development</h5>
//                             <p className="text-muted mb-1">In Progress</p>
//                             <div className="progress custom-progress mb-2">
//                                 <div
//                                     className="progress-bar bg-success"
//                                     role="progressbar"
//                                     style={{ width: `${progressPercentage}%` }}
//                                     aria-valuenow={progressPercentage}
//                                     aria-valuemin="0"
//                                     aria-valuemax="100"
//                                 />
//                             </div>
//                             <small className="text-muted">
//                                 {progressPercentage.toFixed(0)}% completed
//                             </small>
//                             <div className="mt-2">
//                                 <button className="btn btn-primary" onClick={() => navigate("/web")}>
//                                     Resume
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Tab Buttons */}
//             <div className="btn-group mt-4 w-100" role="group">
//                 <button
//                     className={`btn ${activeSection === "content" ? "btn-dark" : "btn-outline-dark"}`}
//                     onClick={() => toggleSection("content")}
//                 >
//                     <FaBook className="me-2" /> Content
//                 </button>
//                 <button
//                     className={`btn ${activeSection === "assessments" ? "btn-dark" : "btn-outline-dark"} `}
//                     onClick={() => toggleSection("assessments")}
//                 >
//                     <FaListAlt className="me-2" /> Assessments
//                 </button>
//             </div>

//             {/* Content Section */}
//             {activeSection === "content" && <SoftwareDeveloper />}

//             {/* Assessments Section */}
//             {activeSection === "assessments" && (
//                 <div>
//                     <h5>Assessments</h5>
//                     <p className="text-muted">Check your progress and complete pending assessments.</p>
//                     <ul className="list-group">
//                         {[1, 2, 3, 4].map((id) => (
//                             <li
//                                 className="list-group-item d-flex justify-content-between align-items-center py-3"
//                                 key={id}
//                                 style={{
//                                     pointerEvents: assessmentStatuses[id]?.status === "completed" ? "none" : "auto",
//                                     opacity: assessmentStatuses[id]?.status === "completed" ? 0.5 : 1
//                                 }}
//                             >
//                                 <div className="d-flex align-items-center">
//                                     <img
//                                         src={require("../img/doc.gif")}
//                                         alt="Assessment thumbnail"
//                                         className="me-2"
//                                         style={{ width: "40px", height: "40px" }}
//                                     />
//                                     <div className="d-flex flex-column">
//                                         {assessmentStatuses[id]?.status !== "completed" ? (
//                                             <Link
//                                                 to={`/assessment-soft/${id}`}
//                                                 className="text-decoration-none text-dark"
//                                                 onClick={() => handleAssessmentCompletion(id)} // Mark assessment as completed
//                                             >
//                                                 Assessment {id}
//                                             </Link>
//                                         ) : (
//                                             <span className="text-muted">Assessment {id} (Completed)</span>
//                                         )}
//                                         <span style={{ fontSize: "14px", color: "black" }}>
//                                             {assessmentStatuses[id]?.status || "Loading..."}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="d-none d-md-flex align-items-center">
//                                     {assessmentStatuses[id]?.status === "completed" ? (
//                                         <span className="badge bg-success rounded-pill">
//                                             <FaCheckCircle /> Completed
//                                         </span>
//                                     ) : (
//                                         <span className="badge bg-warning rounded-pill">Pending</span>
//                                     )}
//                                 </div>
//                             </li>
//                         ))}

//                         {/* Fifth assessment, locked until all prior assessments are completed */}
//                         <li
//                             className="list-group-item d-flex justify-content-between align-items-center py-3"
//                             style={!arePreviousAssessmentsCompleted(5) ? { pointerEvents: "none", opacity: "0.5" } : {}}
//                             key={5}
//                         >
//                             <div className="d-flex align-items-center">
//                                 <img
//                                     src={require("../img/doc.gif")}
//                                     alt="Assessment 5 thumbnail"
//                                     className="me-2"
//                                     style={{ width: "40px", height: "40px" }}
//                                 />
//                                 <div className="d-flex flex-column">
//                                     {assessmentStatuses[5]?.status !== "completed" ? (
//                                         <Link to="/assessment-soft/5" className="text-decoration-none text-dark">
//                                             Assessment 5
//                                         </Link>
//                                     ) : (
//                                         <span className="text-muted">Assessment 5 (Completed)</span>
//                                     )}
//                                     <span style={{ fontSize: "14px", color: "black" }}>
//                                         {assessmentStatuses[5]?.status || "Loading..."}
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="d-none d-md-flex align-items-center">
//                                 {assessmentStatuses[5]?.status === "completed" ? (
//                                     <span className="badge bg-success rounded-pill">
//                                         <FaCheckCircle /> Completed
//                                     </span>
//                                 ) : (
//                                     <span className="badge bg-warning rounded-pill">Locked</span>
//                                 )}
//                             </div>
//                         </li>
//                     </ul>

//                     {/* Show the certificate button if the fifth assessment is completed */}
//                     {isFifthAssessmentCompleted && (
//                         <div className="mt-4">
//                             <Link to="/new-certificate">
//                                 <button className="btn btn-success mt-4">Show Certificate</button>
//                             </Link>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CoursePage;
