import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:8000",
//   // withCredentials: false,
//   // headers: {
//   //   "Access-Control-Allow-Origin": "*",
//   //   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//   // },
// });
export default axios.create({
  baseURL: "https://mediascheduler-backend.production.rehanshakir.com",
});
