// import Breadcrumb from "@/components/Breadcrumb";
// import ErrorLayer from "@/components/ErrorLayer";
// import MasterLayout from "@/masterLayout/MasterLayout";

// export default function NotFound() {
//   return (
//     <>
//       {/* MasterLayout */}
//       <MasterLayout>
//         {/* Breadcrumb */}
//         <Breadcrumb title='404' />

//         {/* ErrorLayer */}
//         <ErrorLayer />
//       </MasterLayout>
//     </>
//   );
// }


// app/not-found.jsx

export default function NotFound() {
  return (
    <div className="text-center p-5">
      <h1 className="text-danger fw-bold">404 - Page Not Found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
    </div>
  );
}
