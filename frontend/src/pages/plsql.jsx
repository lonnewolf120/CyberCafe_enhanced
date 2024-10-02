// import React, { useEffect, useState } from "react";
// import { Button, Table, Textarea } from "flowbite-react";
// import axios from "axios";
// import { useAuth } from '../../structure/GlobalStateProvider.jsx';
// import { useSnackbar } from "notistack";
// import { Typography } from "@material-tailwind/react";

// const PLSQL = ({ title, image, url, info }) => {
//   const [sqlQuery, setQuery] = useState("");
//   const [tablesData, setTableData] = useState([]);
//   const [queryData, setQueryData] = useState([]);
//   const { authState } = useAuth();
//   const { enqueueSnackbar } = useSnackbar();

//   async function operateQuery(query) {
//     axios.post(`http://localhost:5000/api/v1/practice/plsql/executeQuery`, { query }, {
//         headers: { 'Authorization': authState.token }
//       })
//       .then((res) => {
//         console.log(res.data);
//         setQueryData(res.data);      
//       })
//       .catch((e) => {
//         enqueueSnackbar("Login first to execute queries", { variant: "error" });
//         console.log("error:", e.message);
//       });
//   }

//   async function getTables() {
//     axios
//       .get(`http://localhost:5000/api/v1/practice/plsql/get-all`, {
//         headers: { 'Authorization': authState.token }
//       })
//       .then((res) => {
//         setTableData(res.data);
//       })
//       .catch((e) => {
//         enqueueSnackbar("Login first to execute queries", { variant: "error" });
//         console.log("Err from plsql.jsx (getTables func): ", e.message);
//       });
//   }

//   useEffect(() => {
//     getTables();
//   }, []);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-700 p-6">
//       <div className="flex w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg">
        
//         <div className="mr-4 flex flex-1 flex-col items-center max-w-screen-md">
//           <h1 className="mb-4 text-3xl font-bold">{title}</h1>
//           <img
//             src="/sql.png"
//             alt={title}
//             className="mb-4 h-32 w-32 rounded-full shadow-md"
//           />
//           <p className="mb-4 text-gray-700">{info}</p>
//           <Textarea
//             id="plsql-query"
//             placeholder="Enter your PL/SQL query"
//             rows={10}
//             className="mb-4 w-full"
//             onChange={(e) => { setQuery(e.target.value) }}
//           />
//           <Button
//             className="w-full"
//             onClick={() => {
//               operateQuery(sqlQuery);
//               console.log("PL/SQL query submitted");
//             }}
//           >
//             Submit Query
//           </Button>
          
//           {/* Display Query Results */}
//           <div className="mt-4 w-full rounded-lg border border-gray-300 p-4 shadow-inner">
//             {queryData.length > 0 && (
//               <div className="w-full overflow-x-auto">
//                 <Table className="max-w-60 divide-y divide-gray-200">
//                   <Table.Head>
//                     {Object.keys(queryData[0]).map((key, index) => (
//                       <Table.HeadCell key={index}>{key}</Table.HeadCell>
//                     ))}
//                   </Table.Head>
//                   <Table.Body className="divide-y divide-gray-200 bg-white">
//                     {queryData.map((row, rowIndex) => (
//                       <Table.Row key={rowIndex} className="whitespace-nowrap">
//                         {Object.values(row).map((cell, cellIndex) => (
//                           <Table.Cell key={cellIndex} className="px-3 py-2">
//                             {cell}
//                           </Table.Cell>
//                         ))}
//                       </Table.Row>
//                     ))}
//                   </Table.Body>
//                 </Table>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="flex flex-col items-center">
//           <h2 className="px-2 my-2 text-xl text-center text-black"><Typography>The tables</Typography></h2>
//           <p>They're dynamic, will change as you</p>
//           <p className="my-2"> update in queries, scroll to view all</p>
//           <div className="max-h-96 w-80 overflow-auto rounded-lg border border-gray-300 p-4 shadow-inner">
//             {tablesData.map((table, index) => (
//               <div key={index} className="mb-4">
//                 <h2 className="mb-2 text-lg font-semibold">{table.name}</h2>
//                 <Table className="min-w-full divide-y divide-gray-200">
//                   <Table.Head>
//                     {table.rows[0].map((header, i) => (
//                       <Table.HeadCell key={i}>{header}</Table.HeadCell>
//                     ))}
//                   </Table.Head>
//                   <Table.Body className="divide-y divide-gray-200 bg-white">
//                     {table.rows.slice(1).map((row, rowIndex) => (
//                       <Table.Row key={rowIndex} className="whitespace-nowrap">
//                         {row.map((cell, cellIndex) => (
//                           <Table.Cell key={cellIndex} className="px-3 py-2">
//                             {cell}
//                           </Table.Cell>
//                         ))}
//                       </Table.Row>
//                     ))}
//                   </Table.Body>
//                 </Table>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PLSQL;
