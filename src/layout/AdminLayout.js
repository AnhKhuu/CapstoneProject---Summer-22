// import React from 'react';
// import { useLocation, Link } from 'react-router-dom';

// export default function AdminLayout(children) {
//   const location = useLocation();

//   const path = location.pathname;

//   return (
//     <div className="shadow-hsc_shadow fixed min-h-screen z-20 w-72 bg-white">
//       <div className="py-8 pl-8">
//         <a href="https://www.medx.vn" target="_blank" rel="noreferrer">
//           <img src="/hsc-medx-logo.png" alt="logo" />
//         </a>
//       </div>
//       <hr />
//       <ul>
//         <Link to="/admin/hsc">
//           <li
//             id="enter-topic"
//             className={`my-3 w-full cursor-pointer hover:border-hsc_purple ${
//               (path === '/admin/hsc' ||
//                 path.includes('/admin/hsc/edit-question') ||
//                 path === '/admin/hsc/upload-excel') &&
//               'border-hsc_purple'
//             } border-transparent group border-r-4 transition-all ease-linear no-underline`}
//           >
//             <div
//               className={` group-hover:text-hsc_purple ${
//                 path === '/admin/hsc' ||
//                 path.includes('/admin/hsc/edit-question') ||
//                 path === '/admin/hsc/upload-excel'
//                   ? 'text-hsc_purple'
//                   : 'text-hsc_black_text'
//               } py-3 px-9 t w-full flex`}
//             >
//               {path === '/admin/hsc' ||
//               path.includes('/admin/hsc/edit-question') ||
//               path === '/admin/hsc/upload-excel' ? (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
//                     stroke="#6956E5"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
//                     stroke="#454E55"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               )}
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
//                   stroke="#6956E5"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <span className="ml-4">Nhập đề</span>
//             </div>
//           </li>
//         </Link>
//         <Link to="/admin/hsc/manage">
//           <li
//             id="manage-topic"
//             className={`${
//               path === '/admin/hsc/manage' ||
//               path === '/admin/hsc/manage/question' ||
//               path === '/admin/hsc/manage/time'
//                 ? 'border-hsc_purple'
//                 : ''
//             } my-3 w-full hover:cursor-pointer group hover:border-hsc_purple border-transparent border-r-4  transition-all ease-linear`}
//           >
//             <div
//               className={`group-hover:text-hsc_purple ${
//                 path === '/admin/hsc/manage' ||
//                 path === '/admin/hsc/manage/question' ||
//                 path === '/admin/hsc/manage/time'
//                   ? 'text-hsc_purple'
//                   : 'text-hsc_black_text'
//               } py-3 px-9 w-full hover:no-underline flex`}
//             >
//               {path === '/admin/hsc/manage' ||
//               path === '/admin/hsc/manage/question' ||
//               path === '/admin/hsc/manage/time' ? (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M18 3C17.2044 3 16.4413 3.31607 15.8787 3.87868C15.3161 4.44129 15 5.20435 15 6V18C15 18.7956 15.3161 19.5587 15.8787 20.1213C16.4413 20.6839 17.2044 21 18 21C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 17.2044 20.6839 16.4413 20.1213 15.8787C19.5587 15.3161 18.7956 15 18 15H6C5.20435 15 4.44129 15.3161 3.87868 15.8787C3.31607 16.4413 3 17.2044 3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21C6.79565 21 7.55871 20.6839 8.12132 20.1213C8.68393 19.5587 9 18.7956 9 18V6C9 5.20435 8.68393 4.44129 8.12132 3.87868C7.55871 3.31607 6.79565 3 6 3C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6C3 6.79565 3.31607 7.55871 3.87868 8.12132C4.44129 8.68393 5.20435 9 6 9H18C18.7956 9 19.5587 8.68393 20.1213 8.12132C20.6839 7.55871 21 6.79565 21 6C21 5.20435 20.6839 4.44129 20.1213 3.87868C19.5587 3.31607 18.7956 3 18 3Z"
//                     stroke="#6956E5"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M18 3C17.2044 3 16.4413 3.31607 15.8787 3.87868C15.3161 4.44129 15 5.20435 15 6V18C15 18.7956 15.3161 19.5587 15.8787 20.1213C16.4413 20.6839 17.2044 21 18 21C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 17.2044 20.6839 16.4413 20.1213 15.8787C19.5587 15.3161 18.7956 15 18 15H6C5.20435 15 4.44129 15.3161 3.87868 15.8787C3.31607 16.4413 3 17.2044 3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21C6.79565 21 7.55871 20.6839 8.12132 20.1213C8.68393 19.5587 9 18.7956 9 18V6C9 5.20435 8.68393 4.44129 8.12132 3.87868C7.55871 3.31607 6.79565 3 6 3C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6C3 6.79565 3.31607 7.55871 3.87868 8.12132C4.44129 8.68393 5.20435 9 6 9H18C18.7956 9 19.5587 8.68393 20.1213 8.12132C20.6839 7.55871 21 6.79565 21 6C21 5.20435 20.6839 4.44129 20.1213 3.87868C19.5587 3.31607 18.7956 3 18 3Z"
//                     stroke="#454E55"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               )}
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M18 3C17.2044 3 16.4413 3.31607 15.8787 3.87868C15.3161 4.44129 15 5.20435 15 6V18C15 18.7956 15.3161 19.5587 15.8787 20.1213C16.4413 20.6839 17.2044 21 18 21C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 17.2044 20.6839 16.4413 20.1213 15.8787C19.5587 15.3161 18.7956 15 18 15H6C5.20435 15 4.44129 15.3161 3.87868 15.8787C3.31607 16.4413 3 17.2044 3 18C3 18.7956 3.31607 19.5587 3.87868 20.1213C4.44129 20.6839 5.20435 21 6 21C6.79565 21 7.55871 20.6839 8.12132 20.1213C8.68393 19.5587 9 18.7956 9 18V6C9 5.20435 8.68393 4.44129 8.12132 3.87868C7.55871 3.31607 6.79565 3 6 3C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6C3 6.79565 3.31607 7.55871 3.87868 8.12132C4.44129 8.68393 5.20435 9 6 9H18C18.7956 9 19.5587 8.68393 20.1213 8.12132C20.6839 7.55871 21 6.79565 21 6C21 5.20435 20.6839 4.44129 20.1213 3.87868C19.5587 3.31607 18.7956 3 18 3Z"
//                   stroke="#6956E5"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//               <span className="ml-4 ">Quản lý đề</span>
//             </div>
//           </li>
//         </Link>
//         <Link to="/admin/hsc/statistics">
//           <li
//             className={`${
//               path === '/admin/hsc/statistics' ? 'border-hsc_purple' : ''
//             } my-3 w-full hover:cursor-pointer group hover:border-hsc_purple border-transparent border-r-4 flex  transition-all ease-linear`}
//           >
//             <div
//               href="/admin/hsc/statistics"
//               className={`${
//                 path === '/admin/hsc/statistics'
//                   ? 'text-hsc_purple'
//                   : 'text-hsc_black_text'
//               } py-3 px-9 w-full hover:no-underline group-hover:text-hsc_purple`}
//             >
//               <i
//                 className={`${
//                   path === '/admin/hsc/statistics'
//                     ? 'text-hsc_purple'
//                     : 'text-hsc_black_tex'
//                 } fa fa-signal mr-4`}
//               ></i>
//               <span>Thống kê</span>
//             </div>
//           </li>
//         </Link>
//       </ul>
//     </div>
//   );
// }
