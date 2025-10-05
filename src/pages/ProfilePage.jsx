// // import React, { useState, useEffect } from "react";
// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   setUserDetails,
// //   setSignedIn,
// //   setFirstTime,
// //   resetUser,
// //   setUserRegistry,
// // } from "../redux/userSlice";

// // import ProfileForm from "../components/common/ProfileForm";
// // import UserDetails from "../components/common/UserDetails";
// // import Alert from "../components/common/Alert";
// // import { formatFormData, getRoleFromEmail } from "../utils/helpers";
// // import { Link, useNavigate } from "react-router-dom";

// // import {
// //   Breadcrumb,
// //   BreadcrumbList,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb";
// // import { Edit3, Home, User } from "lucide-react";

// // const USERS_KEY = "tvkUsers";

// // const ProfilePage = () => {
// //   const dispatch = useDispatch();
// //   const userData = useSelector((state) => state.user || {});
// //   const isSignedIn = userData?.isSignedIn || false;
// //   const isFirstTime = userData?.isFirstTime || true;

// //   const navigate = useNavigate();
// //   const [errors, setErrors] = useState({});
// //   const [touched, setTouched] = useState({});
// //   const [isSubmitted, setIsSubmitted] = useState(false);
// //   const [toastMessage, setToastMessage] = useState("");
// //   const [showToast, setShowToast] = useState(false);

// //   useEffect(() => {
// //     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
// //     const signedInUser = Object.values(users).find((u) => u.isSignedIn);

// //     dispatch(setUserRegistry(users));
// //     if (signedInUser) {
// //       dispatch(setUserDetails(signedInUser));
// //       dispatch(setSignedIn(true));
// //       dispatch(setFirstTime(false));
// //       localStorage.setItem("tvkSignedIn", "true");
// //     } else {
// //       localStorage.setItem("tvkSignedIn", "false");
// //     }
// //   }, [dispatch]);

// //   const triggerToast = (msg) => {
// //     setToastMessage(msg);
// //     setShowToast(true);
// //     setTimeout(() => setShowToast(false), 7000);
// //   };

// //   const handleBlur = (e) => {
// //     const { name } = e.target;
// //     setTouched((prev) => ({ ...prev, [name]: true }));

// //     if (!userData[name]) {
// //       setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
// //     } else {
// //       setErrors((prev) => {
// //         const newErrors = { ...prev };
// //         delete newErrors[name];
// //         return newErrors;
// //       });
// //     }
// //   };

// //   const handleSignUp = () => {
// //     setIsSubmitted(true);

// //     if (!userData.userName || !userData.email) {
// //       setErrors((prev) => ({
// //         ...prev,
// //         userName: !userData.userName ? "Username is required" : undefined,
// //         email: !userData.email ? "Email is required" : undefined,
// //       }));
// //       localStorage.setItem("tvkSignedIn", "true");
// //       return;
// //     }

// //     const role = getRoleFromEmail(userData.email);
// //     const emailKey = userData.email.toLowerCase();
// //     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

// //     if (users[emailKey]) {
// //       const existingUser = users[emailKey];
// //       existingUser.isSignedIn = true;
// //       users[emailKey] = existingUser;

// //       localStorage.setItem(USERS_KEY, JSON.stringify(users));
// //       dispatch(setUserDetails(existingUser));
// //       dispatch(setSignedIn(true));
// //       dispatch(setFirstTime(false));
// //       triggerToast("Welcome back to TVK 🫡");
// //     } else {
// //       const generateNumber = (length) =>
// //         Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

// //       const userId =
// //         role === "state_Authority"
// //           ? `tvk${generateNumber(5)}`
// //           : role === "district_Authority"
// //             ? `tvk${userData.district}${generateNumber(3)}`
// //             : `tvkuser${generateNumber(3)}`;

// //       const newUser = formatFormData({
// //         ...userData,
// //         role,
// //         userId,
// //         isSignedIn: true,
// //       });

// //       users[emailKey] = newUser;
// //       localStorage.setItem(USERS_KEY, JSON.stringify(users));

// //       dispatch(setUserDetails(newUser));
// //       dispatch(setSignedIn(true));
// //       dispatch(setFirstTime(false));
// //       triggerToast("Welcome to TVK 🎉");
// //     }
// //   };

// //   const handleSignOut = () => {
// //     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
// //     const emailKey = userData.email.toLowerCase();

// //     if (users[emailKey]) {
// //       users[emailKey].isSignedIn = false;
// //       localStorage.setItem(USERS_KEY, JSON.stringify(users));
// //     }

// //     dispatch(resetUser());
// //     dispatch(setSignedIn(false));
// //     triggerToast("Thanks for Joining Us 🙏");
// //     localStorage.removeItem("tvkUserId");
// //     localStorage.setItem("tvkSignedIn", "false");
// //     navigate("/user-profile");
// //   };

// //   return (
// //     <div className="w-full max-vh flex flex-col items-center justify-center p-4 pt-2">
// //       <Alert
// //         message={toastMessage}
// //         show={showToast}
// //         onClose={() => setShowToast(false)}
// //       />

// //       <div className="bg-white shadow-lg rounded-3xl w-full max-w-4xl p-6 flex flex-col gap-6 overflow-y-auto">
// //         {/* Breadcrumb inside card */}
// //         <div className="w-full backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
// //           <Breadcrumb>
// //             <BreadcrumbList className="flex items-center gap-3 text-xl sm:text-xl font-bold">
// //               {/* Home */}
// //               <BreadcrumbItem className="flex items-center gap-2">
// //                 <Home size={24} className="text-gray-500 font-bold " />
// //                 <Link to="/landing" className="text-gray-500 text-2xl">
// //                   Home
// //                 </Link>
// //               </BreadcrumbItem>
// //               <BreadcrumbSeparator />

// //               {/* ProfileForm */}
// //               <BreadcrumbItem className="flex items-center gap-2">
// //                 <Edit3
// //                   size={24}
// //                   className={
// //                     !isSignedIn
// //                       ? "text-green-600 font-bold"
// //                       : "text-gray-500 font-bold"
// //                   }
// //                 />
// //                 {!isSignedIn ? (
// //                   <Link
// //                     to="/user-profile"
// //                     className="text-green-600 font-bold text-2xl"
// //                   >
// //                     ProfileForm
// //                   </Link>
// //                 ) : (
// //                   <span
// //                     className="text-gray-500 cursor-not-allowed"
// //                     onClick={() =>
// //                       triggerToast(
// //                         "Hold up, Commander! Sign out first to revisit ProfileForm 🫡"
// //                       )
// //                     }
// //                   >
// //                     ProfileForm
// //                   </span>
// //                 )}
// //               </BreadcrumbItem>
// //               <BreadcrumbSeparator />

// //               {/* UserDetails */}
// //               <BreadcrumbItem className="flex items-center gap-2">
// //                 <User
// //                   size={24}
// //                   className={
// //                     isSignedIn
// //                       ? "text-green-600 font-bold"
// //                       : "text-gray-500 font-bold"
// //                   }
// //                 />
// //                 {isSignedIn ? (
// //                   <span className="text-green-600 font-bold text-2xl">
// //                     UserDetails
// //                   </span>
// //                 ) : (
// //                   <span
// //                     className="text-gray-500 cursor-not-allowed"
// //                     onClick={() =>
// //                       triggerToast(
// //                         "Access Denied! Sign in to unlock UserDetails 🚫"
// //                       )
// //                     }
// //                   >
// //                     UserDetails
// //                   </span>
// //                 )}
// //               </BreadcrumbItem>
// //             </BreadcrumbList>
// //           </Breadcrumb>
// //         </div>

// //         {/* Image and Details Layout */}
// //         <div className="flex flex-col md:flex-row gap-6">
// //           <div className="flex-1 flex flex-col items-center justify-center">
// //             <img
// //               src="/assets/B1.png"
// //               alt="Profile"
// //               className="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-lg transform transition-transform hover:scale-110"
// //             />
// //             <h4 className="text-3xl sm:text-xl md:text-2xl my-2 font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-center">
// //               உங்களுக்காக நான் வரேன்!
// //             </h4>
// //           </div>

// //           <div className="flex-1 flex flex-col justify-center gap-4">
// //             {!isSignedIn ? (
// //               <ProfileForm
// //                 errors={errors}
// //                 touched={touched}
// //                 isSubmitted={isSubmitted}
// //                 handleBlur={handleBlur}
// //                 handleSignUp={handleSignUp}
// //                 isFirstTime={isFirstTime}
// //               />
// //             ) : (
// //               <UserDetails formData={userData} handleSignOut={handleSignOut} />
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setUserDetails,
//   setSignedIn,
//   setFirstTime,
//   resetUser,
//   setUserRegistry,
// } from "../redux/userSlice";

// import ProfileForm from "../components/common/ProfileForm";
// import UserDetails from "../components/common/UserDetails";
// import Alert from "../components/common/Alert";
// import { formatFormData, getRoleFromEmail } from "../utils/helpers";
// import { Link, useNavigate } from "react-router-dom";

// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Edit3, Home, User } from "lucide-react";

// const USERS_KEY = "tvkUsers";

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.user || {});
//   const isSignedIn = userData?.isSignedIn || false;
//   const isFirstTime = userData?.isFirstTime || true;

//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   useEffect(() => {
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
//     const signedInUser = Object.values(users).find((u) => u.isSignedIn);

//     dispatch(setUserRegistry(users));
//     if (signedInUser) {
//       dispatch(setUserDetails(signedInUser));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       localStorage.setItem("tvkSignedIn", "true");
//     } else {
//       localStorage.setItem("tvkSignedIn", "false");
//     }
//   }, [dispatch]);

//   const triggerToast = (msg) => {
//     setToastMessage(msg);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 7000);
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));

//     if (!userData[name]) {
//       setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
//     } else {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleSignUp = () => {
//     setIsSubmitted(true);

//     if (!userData.userName || !userData.email) {
//       setErrors((prev) => ({
//         ...prev,
//         userName: !userData.userName ? "Username is required" : undefined,
//         email: !userData.email ? "Email is required" : undefined,
//       }));
//       localStorage.setItem("tvkSignedIn", "true");
//       return;
//     }

//     const role = getRoleFromEmail(userData.email);
//     const emailKey = userData.email.toLowerCase();
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

//     if (users[emailKey]) {
//       const existingUser = users[emailKey];
//       existingUser.isSignedIn = true;
//       users[emailKey] = existingUser;

//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//       dispatch(setUserDetails(existingUser));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       triggerToast("Welcome back to TVK 🫡");
//     } else {
//       localStorage.removeItem("tvkUserId"); // ✅ Clear stale ID before formatting

//       const newUser = formatFormData(
//         {
//           ...userData,
//           role,
//           isSignedIn: true,
//         },
//         users // ✅ Pass registry for duplicate check
//       );

//       users[emailKey] = newUser;
//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//       localStorage.setItem("tvkUserId", newUser.userId); // ✅ Persist stable ID
//       localStorage.setItem("tvkSignedIn", "true");

//       dispatch(setUserDetails(newUser));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       triggerToast("Welcome to TVK 🎉");
//     }
//   };

//   const handleSignOut = () => {
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
//     const emailKey = userData.email.toLowerCase();

//     if (users[emailKey]) {
//       users[emailKey].isSignedIn = false;
//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//     }

//     dispatch(resetUser());
//     dispatch(setSignedIn(false));
//     localStorage.removeItem("tvkUserId"); // ✅ Clear session ID
//     localStorage.setItem("tvkSignedIn", "false");
//     triggerToast("Thanks for Joining Us 🙏");
//     navigate("/user-profile");
//   };

//   return (
//     <div className="w-full max-vh flex flex-col items-center justify-center p-4 pt-2">
//       <Alert
//         message={toastMessage}
//         show={showToast}
//         onClose={() => setShowToast(false)}
//       />

//       <div className="bg-white shadow-lg rounded-3xl w-full max-w-4xl p-6 flex flex-col gap-6 overflow-y-auto">
//         {/* Breadcrumb inside card */}
//         <div className="w-full backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
//           <Breadcrumb>
//             <BreadcrumbList className="flex items-center gap-3 text-xl sm:text-xl font-bold">
//               {/* Home */}
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <Home size={24} className="text-gray-500 font-bold " />
//                 <Link to="/landing" className="text-gray-500 text-2xl">
//                   Home
//                 </Link>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />

//               {/* ProfileForm */}
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <Edit3
//                   size={24}
//                   className={
//                     !isSignedIn
//                       ? "text-green-600 font-bold"
//                       : "text-gray-500 font-bold"
//                   }
//                 />
//                 {!isSignedIn ? (
//                   <Link
//                     to="/user-profile"
//                     className="text-green-600 font-bold text-2xl"
//                   >
//                     ProfileForm
//                   </Link>
//                 ) : (
//                   <span
//                     className="text-gray-500 cursor-not-allowed"
//                     onClick={() =>
//                       triggerToast(
//                         "Hold up, Commander! Sign out first to revisit ProfileForm 🫡"
//                       )
//                     }
//                   >
//                     ProfileForm
//                   </span>
//                 )}
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />

//               {/* UserDetails */}
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <User
//                   size={24}
//                   className={
//                     isSignedIn
//                       ? "text-green-600 font-bold"
//                       : "text-gray-500 font-bold"
//                   }
//                 />
//                 {isSignedIn ? (
//                   <span className="text-green-600 font-bold text-2xl">
//                     UserDetails
//                   </span>
//                 ) : (
//                   <span
//                     className="text-gray-500 cursor-not-allowed"
//                     onClick={() =>
//                       triggerToast(
//                         "Access Denied! Sign in to unlock UserDetails 🚫"
//                       )
//                     }
//                   >
//                     UserDetails
//                   </span>
//                 )}
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>

//         {/* Image and Details Layout */}
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <img
//               src="/assets/B1.png"
//               alt="Profile"
//               className="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-lg transform transition-transform hover:scale-110"
//             />
//             <h4 className="text-3xl sm:text-xl md:text-2xl my-2 font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-center">
//               உங்களுக்காக நான் வரேன்!
//             </h4>
//           </div>

//           <div className="flex-1 flex flex-col justify-center gap-4">
//             {!isSignedIn ? (
//               <ProfileForm
//                 errors={errors}
//                 touched={touched}
//                 isSubmitted={isSubmitted}
//                 handleBlur={handleBlur}
//                 handleSignUp={handleSignUp}
//                 isFirstTime={isFirstTime}
//               />
//             ) : (
//               <UserDetails formData={userData} handleSignOut={handleSignOut} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
// -------------------

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   setUserDetails,
//   setSignedIn,
//   setFirstTime,
//   resetUser,
//   setUserRegistry,
// } from "../redux/userSlice";

// import ProfileForm from "../components/common/ProfileForm";
// import UserDetails from "../components/common/UserDetails";
// import Alert from "../components/common/Alert";
// import { formatFormData, getRoleFromEmail } from "../utils/helpers";
// import { Link, useNavigate } from "react-router-dom";

// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Edit3, Home, User } from "lucide-react";

// const USERS_KEY = "tvkUsers";

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.user || {});
//   const isSignedIn = userData?.isSignedIn || false;
//   const isFirstTime = userData?.isFirstTime || true;

//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   useEffect(() => {
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
//     const signedInUser = Object.values(users).find((u) => u.isSignedIn);
//     const hydrated = sessionStorage.getItem("tvkHydrated") === "true";

//     dispatch(setUserRegistry(users));

//     if (signedInUser && !hydrated) {
//       dispatch(setUserDetails({ ...signedInUser, source: "ProfilePage" }));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       localStorage.setItem("tvkSignedIn", "true");
//       sessionStorage.setItem("tvkHydrated", "true");
//     } else {
//       localStorage.setItem("tvkSignedIn", "false");
//     }
//   }, [dispatch]);

//   const triggerToast = (msg) => {
//     setToastMessage(msg);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 7000);
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));

//     if (!userData[name]) {
//       setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
//     } else {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleSignUp = () => {
//     setIsSubmitted(true);

//     if (!userData.userName || !userData.email) {
//       setErrors((prev) => ({
//         ...prev,
//         userName: !userData.userName ? "Username is required" : undefined,
//         email: !userData.email ? "Email is required" : undefined,
//       }));
//       localStorage.setItem("tvkSignedIn", "true");
//       return;
//     }

//     const role = getRoleFromEmail(userData.email);
//     const emailKey = userData.email.toLowerCase();
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

//     if (users[emailKey]) {
//       const existingUser = users[emailKey];
//       existingUser.isSignedIn = true;
//       users[emailKey] = existingUser;

//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//       dispatch(setUserDetails({ ...existingUser, source: "ProfilePage" }));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       triggerToast("Welcome back to TVK 🫡");
//     } else {
//       localStorage.removeItem("tvkUserId");

//       const newUser = formatFormData(
//         {
//           ...userData,
//           role,
//           isSignedIn: true,
//         },
//         users
//       );

//       users[emailKey] = newUser;
//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//       localStorage.setItem("tvkUserId", newUser.userId);
//       localStorage.setItem("tvkSignedIn", "true");

//       dispatch(setUserDetails({ ...newUser, source: "ProfilePage" }));
//       dispatch(setSignedIn(true));
//       dispatch(setFirstTime(false));
//       triggerToast("Welcome to TVK 🎉");
//     }
//   };

//   const handleSignOut = () => {
//     const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
//     const emailKey = userData.email.toLowerCase();

//     if (users[emailKey]) {
//       users[emailKey].isSignedIn = false;
//       localStorage.setItem(USERS_KEY, JSON.stringify(users));
//     }

//     dispatch(resetUser());
//     dispatch(setSignedIn(false));
//     localStorage.removeItem("tvkUserId");
//     localStorage.setItem("tvkSignedIn", "false");
//     sessionStorage.removeItem("tvkHydrated");
//     triggerToast("Thanks for Joining Us 🙏");
//     navigate("/user-profile");
//   };

//   return (
//     <div className="w-full max-vh flex flex-col items-center justify-center p-4 pt-2">
//       <Alert
//         message={toastMessage}
//         show={showToast}
//         onClose={() => setShowToast(false)}
//       />

//       <div className="bg-white shadow-lg rounded-3xl w-full max-w-4xl p-6 flex flex-col gap-6 overflow-y-auto">
//         <div className="w-full backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
//           <Breadcrumb>
//             <BreadcrumbList className="flex items-center gap-3 text-xl sm:text-xl font-bold">
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <Home size={24} className="text-gray-500 font-bold " />
//                 <Link to="/landing" className="text-gray-500 text-2xl">
//                   Home
//                 </Link>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <Edit3
//                   size={24}
//                   className={
//                     !isSignedIn
//                       ? "text-green-600 font-bold"
//                       : "text-gray-500 font-bold"
//                   }
//                 />
//                 {!isSignedIn ? (
//                   <Link
//                     to="/user-profile"
//                     className="text-green-600 font-bold text-2xl"
//                   >
//                     ProfileForm
//                   </Link>
//                 ) : (
//                   <span
//                     className="text-gray-500 cursor-not-allowed"
//                     onClick={() =>
//                       triggerToast(
//                         "Hold up, Commander! Sign out first to revisit ProfileForm 🫡"
//                       )
//                     }
//                   >
//                     ProfileForm
//                   </span>
//                 )}
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem className="flex items-center gap-2">
//                 <User
//                   size={24}
//                   className={
//                     isSignedIn
//                       ? "text-green-600 font-bold"
//                       : "text-gray-500 font-bold"
//                   }
//                 />
//                 {isSignedIn ? (
//                   <span className="text-green-600 font-bold text-2xl">
//                     UserDetails
//                   </span>
//                 ) : (
//                   <span
//                     className="text-gray-500 cursor-not-allowed"
//                     onClick={() =>
//                       triggerToast(
//                         "Access Denied! Sign in to unlock UserDetails 🚫"
//                       )
//                     }
//                   >
//                     UserDetails
//                   </span>
//                 )}
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <img
//               src="/assets/B1.png"
//               alt="Profile"
//               className="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-lg transform transition-transform hover:scale-110"
//             />
//             <h4 className="text-3xl sm:text-xl md:text-2xl my-2 font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-center">
//               உங்களுக்காக நான் வரேன்!
//             </h4>
//           </div>

//           <div className="flex-1 flex flex-col justify-center gap-4">
//             {!isSignedIn ? (
//               <ProfileForm
//                 errors={errors}
//                 touched={touched}
//                 isSubmitted={isSubmitted}
//                 handleBlur={handleBlur}
//                 handleSignUp={handleSignUp}
//                 isFirstTime={isFirstTime}
//               />
//             ) : (
//               <UserDetails formData={userData} handleSignOut={handleSignOut} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// -----------------------

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserDetails,
  setSignedIn,
  setFirstTime,
  resetUser,
  setUserRegistry,
  setUserRegistryEntry, // ✅ Added
} from "../redux/userSlice";

import ProfileForm from "../components/common/ProfileForm";
import UserDetails from "../components/common/UserDetails";
import Alert from "../components/common/Alert";
import { formatFormData, getRoleFromEmail } from "../utils/helpers";
import { Link, useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Edit3, Home, User } from "lucide-react";

const USERS_KEY = "tvkUsers";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user || {});
  const isSignedIn = userData?.isSignedIn || false;
  const isFirstTime = userData?.isFirstTime || true;

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    const signedInUser = Object.values(users).find((u) => u.isSignedIn);
    const hydrated = sessionStorage.getItem("tvkHydrated") === "true";

    dispatch(setUserRegistry(users));

    if (signedInUser && !hydrated) {
      dispatch(setUserDetails({ ...signedInUser, source: "ProfilePage" }));
      dispatch(setSignedIn(true));
      dispatch(setFirstTime(false));
      localStorage.setItem("tvkSignedIn", "true");
      sessionStorage.setItem("tvkHydrated", "true");
    } else {
      localStorage.setItem("tvkSignedIn", "false");
    }
  }, [dispatch]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 7000);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (!userData[name]) {
      setErrors((prev) => ({ ...prev, [name]: `${name} is required` }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSignUp = () => {
    setIsSubmitted(true);

    if (!userData.userName || !userData.email) {
      setErrors((prev) => ({
        ...prev,
        userName: !userData.userName ? "Username is required" : undefined,
        email: !userData.email ? "Email is required" : undefined,
      }));
      localStorage.setItem("tvkSignedIn", "true");
      return;
    }

    const role = getRoleFromEmail(userData.email);
    const emailKey = userData.email.toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};

    if (users[emailKey]) {
      const existingUser = users[emailKey];
      existingUser.isSignedIn = true;
      users[emailKey] = existingUser;

      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      dispatch(setUserDetails({ ...existingUser, source: "ProfilePage" }));
      dispatch(setSignedIn(true));
      dispatch(setFirstTime(false));
      triggerToast("Welcome back to TVK 🫡");
    } else {
      localStorage.removeItem("tvkUserId");

      const newUser = formatFormData(
        {
          ...userData,
          role,
          isSignedIn: true,
        },
        users
      );

      // ✅ Sync registry entry with final userId
      users[emailKey] = newUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem("tvkUserId", newUser.userId);
      localStorage.setItem("tvkSignedIn", "true");

      dispatch(setUserDetails({ ...newUser, source: "ProfilePage" }));
      dispatch(
        setUserRegistryEntry({ userId: newUser.userId, userData: newUser })
      );
      dispatch(setSignedIn(true));
      dispatch(setFirstTime(false));
      triggerToast("Welcome to TVK 🎉");
    }
  };

  const handleSignOut = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    const emailKey = userData.email.toLowerCase();

    if (users[emailKey]) {
      users[emailKey].isSignedIn = false;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    dispatch(resetUser());
    dispatch(setSignedIn(false));
    localStorage.removeItem("tvkUserId");
    localStorage.setItem("tvkSignedIn", "false");
    sessionStorage.removeItem("tvkHydrated");
    triggerToast("Thanks for Joining Us 🙏");
    navigate("/user-profile");
  };

  return (
    <div className="w-full max-vh flex flex-col items-center justify-center p-4 pt-2">
      <Alert
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="bg-white shadow-lg rounded-3xl w-full max-w-4xl p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="w-full backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-3 text-xl sm:text-xl font-bold">
              <BreadcrumbItem className="flex items-center gap-2">
                <Home size={24} className="text-gray-500 font-bold " />
                <Link to="/landing" className="text-gray-500 text-2xl">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="flex items-center gap-2">
                <Edit3
                  size={24}
                  className={
                    !isSignedIn
                      ? "text-green-600 font-bold"
                      : "text-gray-500 font-bold"
                  }
                />
                {!isSignedIn ? (
                  <Link
                    to="/user-profile"
                    className="text-green-600 font-bold text-2xl"
                  >
                    ProfileForm
                  </Link>
                ) : (
                  <span
                    className="text-gray-500 cursor-not-allowed"
                    onClick={() =>
                      triggerToast(
                        "Hold up, Commander! Sign out first to revisit ProfileForm 🫡"
                      )
                    }
                  >
                    ProfileForm
                  </span>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="flex items-center gap-2">
                <User
                  size={24}
                  className={
                    isSignedIn
                      ? "text-green-600 font-bold"
                      : "text-gray-500 font-bold"
                  }
                />
                {isSignedIn ? (
                  <span className="text-green-600 font-bold text-2xl">
                    UserDetails
                  </span>
                ) : (
                  <span
                    className="text-gray-500 cursor-not-allowed"
                    onClick={() =>
                      triggerToast(
                        "Access Denied! Sign in to unlock UserDetails 🚫"
                      )
                    }
                  >
                    UserDetails
                  </span>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            <img
              src="/assets/B1.png"
              alt="Profile"
              className="w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-lg transform transition-transform hover:scale-110"
            />
            <h4 className="text-3xl sm:text-xl md:text-2xl my-2 font-extrabold tracking-wide bg-gradient-to-r from-red-600 to-yellow-400 bg-clip-text text-transparent text-center">
              உங்களுக்காக நான் வரேன்!
            </h4>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            {!isSignedIn ? (
              <ProfileForm
                errors={errors}
                touched={touched}
                isSubmitted={isSubmitted}
                handleBlur={handleBlur}
                handleSignUp={handleSignUp}
                isFirstTime={isFirstTime}
              />
            ) : (
              <UserDetails formData={userData} handleSignOut={handleSignOut} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
