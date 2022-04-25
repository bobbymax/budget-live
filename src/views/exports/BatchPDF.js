// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// //import { Page, Document } from "react-pdf";

// const BatchPDF = ({ data = null }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [batch, setBatch] = useState(null);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   useEffect(() => {
//     if (data !== null) {
//       setBatch(data);
//     }
//   }, [data]);

//   return (
//     <>
//       <Document file={batch} onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//         <p>
//           Page {pageNumber} of {numPages}
//         </p>
//       </Document>
//     </>
//   );
// };

// export default BatchPDF;
