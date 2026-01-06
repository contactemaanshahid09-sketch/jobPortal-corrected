// "use client";

// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Briefcase,
//   Search,
//   Building2,
//   Calendar,
//   Layers,
//   CheckCircle,
//   MapPin,
//   Users,
//   TrendingUp,
//   X,
//   Eye,
//   Sparkles,
//   ChevronDown,
//   Loader2,
//   User,
//   Trash2, // ← Fixed: Added back Trash2 import
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";

// export default function Page() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/signin");
//     } else if (session?.user.role === "user") {
//       router.push("/user/dashboard");
//     }
//   }, [session, status, router]);

//   const [jobs, setJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [filters, setFilters] = useState({ status: "", type: "" });
//   const [sortBy, setSortBy] = useState("title");
//   const [sortOrder, setSortOrder] = useState("asc");

//   /* ================= AI STATES ================= */
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [aiError, setAiError] = useState("");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setLoadingJobs(true);
//       try {
//         const res = await fetch("/api/jobs");
//         if (!res.ok) throw new Error("Failed to fetch jobs");
//         const data = await res.json();
//         setJobs(data);
//       } catch (err) {
//         setErrorMsg(err.message);
//       } finally {
//         setLoadingJobs(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   /* ================= AI FUNCTION ================= */
//   const runAIAnalysis = async (jobId) => {
//     setAiLoading(true);
//     setAiResult(null);
//     setAiError("");

//     try {
//       const res = await fetch("/api/ai/recommend", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "AI analysis failed");

//       setAiResult(JSON.parse(data.aiResult));
//     } catch (err) {
//       setAiError(err.message);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleDeleteJob = async (id) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;
//     try {
//       const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete job");
//       setJobs((prev) => prev.filter((j) => j._id !== id));
//       setSelectedJob(null);
//       setSuccessMsg("Job deleted successfully!");
//       setTimeout(() => setSuccessMsg(""), 4000);
//     } catch (err) {
//       setErrorMsg(err.message);
//     }
//   };

//   const closeModals = () => {
//     setSelectedJob(null);
//     setAiResult(null);
//     setAiError("");
//   };

//   /* ================= FILTERING & SORTING ================= */
//   const applyFiltersAndSort = (jobsList) => {
//     let filtered = jobsList.filter((job) => {
//       const matchesSearch = `${job.title} ${job.company} ${job.location} ${job.skills?.join(" ")}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchesStatus = filters.status ? job.status === filters.status : true;
//       const matchesType = filters.type ? job.type === filters.type : true;
//       return matchesSearch && matchesStatus && matchesType;
//     });

//     filtered.sort((a, b) => {
//       let aVal = a[sortBy];
//       let bVal = b[sortBy];
//       if (typeof aVal === "string") aVal = aVal.toLowerCase();
//       if (typeof bVal === "string") bVal = bVal.toLowerCase();
//       if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     return filtered;
//   };

//   const filteredAndSortedJobs = applyFiltersAndSort(jobs);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const toggleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };

//   if (status === "loading") return null;
//   if (!session || session.user.role === "user") return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900">
//       <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

//         {/* ================= HEADER ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <h3 className="text-4xl font-bold text-indigo-900 flex items-center justify-center gap-3">
//             <Briefcase className="text-indigo-500" /> Job Management Dashboard
//           </h3>
//           <p className="mt-3 text-lg text-gray-600">View jobs and analyze applicants with AI</p>
//         </motion.div>

//         {/* ================= MESSAGES ================= */}
//         <AnimatePresence>
//           {successMsg && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="p-4 bg-green-100 rounded-2xl text-green-800 flex items-center gap-2 shadow-md"
//             >
//               <CheckCircle /> {successMsg}
//             </motion.div>
//           )}
//           {errorMsg && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="p-4 bg-red-100 rounded-2xl text-red-800 flex items-center gap-2 shadow-md"
//             >
//               <X /> {errorMsg}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ================= FILTERS & SEARCH ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-4"
//         >
//           <div className="relative">
//             <input
//               placeholder="Search jobs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-sm"
//             />
//             <Search className="absolute right-4 top-4 text-gray-500" size={20} />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange("status", e.target.value)}
//             className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
//           >
//             <option value="">All Status</option>
//             <option value="Open">Open</option>
//             <option value="Closed">Closed</option>
//           </select>
//           <select
//             value={filters.type}
//             onChange={(e) => handleFilterChange("type", e.target.value)}
//             className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
//           >
//             <option value="">All Types</option>
//             <option value="Remote">Remote</option>
//             <option value="Onsite">Onsite</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//         </motion.div>

//         {/* ================= JOB TABLE ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full divide-y divide-indigo-100">
//               <thead className="bg-indigo-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("title")}>
//                     Title <ChevronDown size={16} className="inline" />
//                   </th>
//                   <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("company")}>
//                     Company <ChevronDown size={16} className="inline" />
//                   </th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Status</th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Type</th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-indigo-100">
//                 {loadingJobs ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8">
//                       <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
//                     </td>
//                   </tr>
//                 ) : filteredAndSortedJobs.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8 text-gray-500">
//                       No jobs found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredAndSortedJobs.map((job) => (
//                     <motion.tr
//                       key={job._id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="hover:bg-indigo-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 font-semibold text-gray-900">{job.title}</td>
//                       <td className="px-6 py-4 text-gray-900">{job.company}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-sm ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                           {job.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-900">{job.type}</td>
//                       <td className="px-6 py-4 flex gap-2">
//                         <button onClick={() => setSelectedJob(job)} className="p-2 rounded-full hover:bg-indigo-100 transition">
//                           <Eye size={20} className="text-indigo-500" />
//                         </button>
//                         <button onClick={() => handleDeleteJob(job._id)} className="p-2 rounded-full hover:bg-indigo-100 transition">
//                           <Trash2 size={20} className="text-red-500" />
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* ================= VIEW MODAL ================= */}
//         <AnimatePresence>
//           {selectedJob && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white rounded-3xl max-w-5xl w-full p-10 overflow-y-auto max-h-[90vh] shadow-2xl border border-indigo-100"
//               >
//                 <div className="flex justify-between mb-6">
//                   <h2 className="text-3xl font-bold text-indigo-900">{selectedJob.title}</h2>
//                   <button onClick={closeModals}>
//                     <X size={28} className="text-gray-500" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Building2 className="text-indigo-500" />
//                     <span>{selectedJob.company}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <MapPin className="text-indigo-500" />
//                     <span>{selectedJob.location}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <TrendingUp className="text-indigo-500" />
//                     <span>Salary: {selectedJob.salary || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Layers className="text-indigo-500" />
//                     <span>Experience: {selectedJob.experience || "N/A"} years</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Calendar className="text-indigo-500" />
//                     <span>Start: {selectedJob.startDate || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Calendar className="text-indigo-500" />
//                     <span>End: {selectedJob.endDate || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <CheckCircle className="text-indigo-500" />
//                     <span>Status: {selectedJob.status}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Users className="text-indigo-500" />
//                     <span>Type: {selectedJob.type}</span>
//                   </div>
//                 </div>

//                 <p className="mb-6 text-gray-900">{selectedJob.description || "No description provided."}</p>

//                 <div className="mb-8">
//                   <h3 className="text-xl font-bold mb-3 text-indigo-900">Required Skills</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedJob.skills?.length > 0 ? (
//                       selectedJob.skills.map((skill, i) => (
//                         <span key={i} className="px-4 py-2 bg-indigo-100 rounded-full text-indigo-900">
//                           {skill}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-gray-500">No skills listed.</span>
//                     )}
//                   </div>
//                 </div>

//                 {/* ===== AI ANALYZE BUTTON ===== */}
//                 <button
//                   onClick={() => runAIAnalysis(selectedJob._id)}
//                   disabled={aiLoading}
//                   className="w-full mb-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-lg flex justify-center gap-3 shadow-lg hover:shadow-teal-600/50 transition-shadow disabled:cursor-not-allowed"
//                 >
//                   <Sparkles /> {aiLoading ? "Analyzing Applicants..." : "AI Analyze Applicants"}
//                 </button>

//                 {/* ===== AI LOADING ===== */}
//                 {aiLoading && (
//                   <div className="text-center py-6 text-indigo-600 font-semibold flex justify-center gap-3">
//                     <Loader2 className="animate-spin" size={24} />
//                     AI is analyzing candidates...
//                   </div>
//                 )}

//                 {/* ===== AI ERROR ===== */}
//                 {aiError && (
//                   <div className="bg-red-100 p-4 rounded-xl text-red-800 mb-6">
//                     {aiError}
//                   </div>
//                 )}

//                 {/* ===== AI RESULTS ===== */}
//                 {aiResult && (
//                   <div className="space-y-6">
//                     <h3 className="text-2xl font-bold text-indigo-900 mb-4">AI Candidate Rankings</h3>
//                     {aiResult.map((candidate, i) => (
//                       <motion.div
//                         key={i}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: i * 0.1 }}
//                         className="border border-indigo-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-indigo-50/50 to-purple-50/30"
//                       >
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//                           <div>
//                             <h4 className="text-xl font-bold text-indigo-900">
//                               #{i + 1} {candidate.name}
//                             </h4>
//                             {candidate.email && (
//                               <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
//                             )}
//                           </div>
//                           <span className="px-5 py-2 bg-indigo-600 text-white rounded-full font-bold text-lg">
//                             {candidate.score}/100
//                           </span>
//                         </div>

//                         <div className="grid md:grid-cols-2 gap-4 mb-4">
//                           <div>
//                             <p className="font-semibold text-indigo-700">Strengths</p>
//                             <p className="text-gray-700 mt-1">{candidate.strengths}</p>
//                           </div>
//                           <div>
//                             <p className="font-semibold text-indigo-700">Areas for Improvement</p>
//                             <p className="text-gray-700 mt-1">{candidate.weaknesses}</p>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap items-center justify-between gap-4">
//                           <span className="px-4 py-2 bg-teal-100 text-teal-900 rounded-full font-medium">
//                             {candidate.finalVerdict}
//                           </span>

//                           {candidate.email && (
//                             <Link
//                               href={`/profile?email=${encodeURIComponent(candidate.email)}`}
//                               target="_blank"
//                               className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition flex items-center gap-2"
//                             >
//                               <User className="w-5 h-5" />
//                               View Full Profile
//                             </Link>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useSession } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Briefcase,
//   Search,
//   Building2,
//   Calendar,
//   Layers,
//   CheckCircle,
//   MapPin,
//   Users,
//   TrendingUp,
//   X,
//   Eye,
//   Sparkles,
//   ChevronDown,
//   Loader2,
//   User,
//   Trash2,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";

// export default function Page() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/signin");
//     } else if (session?.user.role === "user") {
//       router.push("/user/dashboard");
//     }
//   }, [session, status, router]);

//   const [jobs, setJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [filters, setFilters] = useState({ status: "", type: "" });
//   const [sortBy, setSortBy] = useState("title");
//   const [sortOrder, setSortOrder] = useState("asc");

//   /* ================= AI STATES ================= */
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [aiError, setAiError] = useState("");

//   // NEW: Track updating status per candidate (using email as key)
//   const [updatingStatuses, setUpdatingStatuses] = useState({});

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setLoadingJobs(true);
//       try {
//         const res = await fetch("/api/jobs");
//         if (!res.ok) throw new Error("Failed to fetch jobs");
//         const data = await res.json();
//         setJobs(data);
//       } catch (err) {
//         setErrorMsg(err.message);
//       } finally {
//         setLoadingJobs(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   /* ================= AI FUNCTION ================= */
//   const runAIAnalysis = async (jobId) => {
//     setAiLoading(true);
//     setAiResult(null);
//     setAiError("");
//     setUpdatingStatuses({}); // Clear previous statuses

//     try {
//       const res = await fetch("/api/ai/recommend", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "AI analysis failed");

//       setAiResult(JSON.parse(data.aiResult));
//     } catch (err) {
//       setAiError(err.message);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleDeleteJob = async (id) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;
//     try {
//       const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete job");
//       setJobs((prev) => prev.filter((j) => j._id !== id));
//       setSelectedJob(null);
//       setSuccessMsg("Job deleted successfully!");
//       setTimeout(() => setSuccessMsg(""), 4000);
//     } catch (err) {
//       setErrorMsg(err.message);
//     }
//   };

//   const closeModals = () => {
//     setSelectedJob(null);
//     setAiResult(null);
//     setAiError("");
//     setUpdatingStatuses({});
//   };

//   /* ================= FILTERING & SORTING ================= */
//   const applyFiltersAndSort = (jobsList) => {
//     let filtered = jobsList.filter((job) => {
//       const matchesSearch = `${job.title} ${job.company} ${job.location} ${job.skills?.join(" ")}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase());
//       const matchesStatus = filters.status ? job.status === filters.status : true;
//       const matchesType = filters.type ? job.type === filters.type : true;
//       return matchesSearch && matchesStatus && matchesType;
//     });

//     filtered.sort((a, b) => {
//       let aVal = a[sortBy];
//       let bVal = b[sortBy];
//       if (typeof aVal === "string") aVal = aVal.toLowerCase();
//       if (typeof bVal === "string") bVal = bVal.toLowerCase();
//       if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     return filtered;
//   };

//   const filteredAndSortedJobs = applyFiltersAndSort(jobs);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const toggleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };

//   if (status === "loading") return null;
//   if (!session || session.user.role === "user") return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900">
//       <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

//         {/* ================= HEADER ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <h3 className="text-4xl font-bold text-indigo-900 flex items-center justify-center gap-3">
//             <Briefcase className="text-indigo-500" /> Job Management Dashboard
//           </h3>
//           <p className="mt-3 text-lg text-gray-600">View jobs and analyze applicants with AI</p>
//         </motion.div>

//         {/* ================= MESSAGES ================= */}
//         <AnimatePresence>
//           {successMsg && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="p-4 bg-green-100 rounded-2xl text-green-800 flex items-center gap-2 shadow-md"
//             >
//               <CheckCircle /> {successMsg}
//             </motion.div>
//           )}
//           {errorMsg && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="p-4 bg-red-100 rounded-2xl text-red-800 flex items-center gap-2 shadow-md"
//             >
//               <X /> {errorMsg}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ================= FILTERS & SEARCH ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-4"
//         >
//           <div className="relative">
//             <input
//               placeholder="Search jobs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-sm"
//             />
//             <Search className="absolute right-4 top-4 text-gray-500" size={20} />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange("status", e.target.value)}
//             className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
//           >
//             <option value="">All Status</option>
//             <option value="Open">Open</option>
//             <option value="Closed">Closed</option>
//           </select>
//           <select
//             value={filters.type}
//             onChange={(e) => handleFilterChange("type", e.target.value)}
//             className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
//           >
//             <option value="">All Types</option>
//             <option value="Remote">Remote</option>
//             <option value="Onsite">Onsite</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//         </motion.div>

//         {/* ================= JOB TABLE ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full divide-y divide-indigo-100">
//               <thead className="bg-indigo-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("title")}>
//                     Title <ChevronDown size={16} className="inline" />
//                   </th>
//                   <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("company")}>
//                     Company <ChevronDown size={16} className="inline" />
//                   </th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Status</th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Type</th>
//                   <th className="px-6 py-4 text-left text-indigo-900">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-indigo-100">
//                 {loadingJobs ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8">
//                       <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
//                     </td>
//                   </tr>
//                 ) : filteredAndSortedJobs.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8 text-gray-500">
//                       No jobs found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredAndSortedJobs.map((job) => (
//                     <motion.tr
//                       key={job._id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="hover:bg-indigo-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 font-semibold text-gray-900">{job.title}</td>
//                       <td className="px-6 py-4 text-gray-900">{job.company}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-sm ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                           {job.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-900">{job.type}</td>
//                       <td className="px-6 py-4 flex gap-2">
//                         <button onClick={() => setSelectedJob(job)} className="p-2 rounded-full hover:bg-indigo-100 transition">
//                           <Eye size={20} className="text-indigo-500" />
//                         </button>
//                         <button onClick={() => handleDeleteJob(job._id)} className="p-2 rounded-full hover:bg-indigo-100 transition">
//                           <Trash2 size={20} className="text-red-500" />
//                         </button>
//                       </td>
//                     </motion.tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* ================= VIEW MODAL ================= */}
//         <AnimatePresence>
//           {selectedJob && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white rounded-3xl max-w-5xl w-full p-10 overflow-y-auto max-h-[90vh] shadow-2xl border border-indigo-100"
//               >
//                 <div className="flex justify-between mb-6">
//                   <h2 className="text-3xl font-bold text-indigo-900">{selectedJob.title}</h2>
//                   <button onClick={closeModals}>
//                     <X size={28} className="text-gray-500" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Building2 className="text-indigo-500" />
//                     <span>{selectedJob.company}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <MapPin className="text-indigo-500" />
//                     <span>{selectedJob.location}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <TrendingUp className="text-indigo-500" />
//                     <span>Salary: {selectedJob.salary || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Layers className="text-indigo-500" />
//                     <span>Experience: {selectedJob.experience || "N/A"} years</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Calendar className="text-indigo-500" />
//                     <span>Start: {selectedJob.startDate || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Calendar className="text-indigo-500" />
//                     <span>End: {selectedJob.endDate || "N/A"}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <CheckCircle className="text-indigo-500" />
//                     <span>Status: {selectedJob.status}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-gray-900">
//                     <Users className="text-indigo-500" />
//                     <span>Type: {selectedJob.type}</span>
//                   </div>
//                 </div>

//                 <p className="mb-6 text-gray-900">{selectedJob.description || "No description provided."}</p>

//                 <div className="mb-8">
//                   <h3 className="text-xl font-bold mb-3 text-indigo-900">Required Skills</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedJob.skills?.length > 0 ? (
//                       selectedJob.skills.map((skill, i) => (
//                         <span key={i} className="px-4 py-2 bg-indigo-100 rounded-full text-indigo-900">
//                           {skill}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-gray-500">No skills listed.</span>
//                     )}
//                   </div>
//                 </div>

//                 {/* ===== AI ANALYZE BUTTON ===== */}
//                 <button
//                   onClick={() => runAIAnalysis(selectedJob._id)}
//                   disabled={aiLoading}
//                   className="w-full mb-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-lg flex justify-center gap-3 shadow-lg hover:shadow-teal-600/50 transition-shadow disabled:cursor-not-allowed"
//                 >
//                   <Sparkles /> {aiLoading ? "Analyzing Applicants..." : "AI Analyze Applicants"}
//                 </button>

//                 {/* ===== AI LOADING ===== */}
//                 {aiLoading && (
//                   <div className="text-center py-6 text-indigo-600 font-semibold flex justify-center gap-3">
//                     <Loader2 className="animate-spin" size={24} />
//                     AI is analyzing candidates...
//                   </div>
//                 )}

//                 {/* ===== AI ERROR ===== */}
//                 {aiError && (
//                   <div className="bg-red-100 p-4 rounded-xl text-red-800 mb-6">
//                     {aiError}
//                   </div>
//                 )}

//                 {/* ===== AI RESULTS ===== */}
//                 {aiResult && (
//                   <div className="space-y-6">
//                     <h3 className="text-2xl font-bold text-indigo-900 mb-4">AI Candidate Rankings</h3>
//                     {aiResult.map((candidate, i) => {
//                       const isUpdating = !!updatingStatuses[candidate.email];

//                       const handleStatusChange = async (newStatus) => {
//                         if (!newStatus || !candidate.email) return;

//                         setUpdatingStatuses(prev => ({ ...prev, [candidate.email]: true }));

//                         try {
//                           const res = await fetch("/api/applications/status", {
//                             method: "PATCH",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({
//                               jobId: selectedJob._id,
//                               email: candidate.email,
//                               status: newStatus,
//                             }),
//                           });

//                           if (!res.ok) {
//                             const data = await res.json();
//                             throw new Error(data.message || "Failed to update status");
//                           }

//                           setAiResult((prev) =>
//                             prev.map((c) =>
//                               c.email === candidate.email ? { ...c, applicationStatus: newStatus } : c
//                             )
//                           );

//                           setSuccessMsg(`Status updated to "${newStatus}" for ${candidate.name}`);
//                           setTimeout(() => setSuccessMsg(""), 4000);
//                         } catch (err) {
//                           setErrorMsg(err.message);
//                           setTimeout(() => setErrorMsg(""), 5000);
//                         } finally {
//                           setUpdatingStatuses(prev => ({ ...prev, [candidate.email]: false }));
//                         }
//                       };

//                       return (
//                         <motion.div
//                           key={i}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: i * 0.1 }}
//                           className="border border-indigo-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-indigo-50/50 to-purple-50/30"
//                         >
//                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//                             <div>
//                               <h4 className="text-xl font-bold text-indigo-900">
//                                 #{i + 1} {candidate.name}
//                               </h4>
//                               {candidate.email && (
//                                 <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
//                               )}
//                             </div>
//                             <span className="px-5 py-2 bg-indigo-600 text-white rounded-full font-bold text-lg">
//                               {candidate.score}/100
//                             </span>
//                           </div>

//                           <div className="grid md:grid-cols-2 gap-4 mb-4">
//                             <div>
//                               <p className="font-semibold text-indigo-700">Strengths</p>
//                               <p className="text-gray-700 mt-1">{candidate.strengths}</p>
//                             </div>
//                             <div>
//                               <p className="font-semibold text-indigo-700">Areas for Improvement</p>
//                               <p className="text-gray-700 mt-1">{candidate.weaknesses}</p>
//                             </div>
//                           </div>

//                           <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
//                             <div className="flex items-center gap-3">
//                               <span className="px-4 py-2 bg-teal-100 text-teal-900 rounded-full font-medium">
//                                 {candidate.finalVerdict}
//                               </span>

//                               {candidate.applicationStatus && (
//                                 <span className="px-4 py-2 bg-purple-100 text-purple-900 rounded-full text-sm font-medium">
//                                   {candidate.applicationStatus}
//                                 </span>
//                               )}
//                             </div>

//                             <div className="flex gap-3 w-full sm:w-auto">
//                               {candidate.email && (
//                                 <Link
//                                   href={`/profile?email=${encodeURIComponent(candidate.email)}`}
//                                   target="_blank"
//                                   className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition flex items-center gap-2 flex-1 sm:flex-initial justify-center"
//                                 >
//                                   <User className="w-5 h-5" />
//                                   View Profile
//                                 </Link>
//                               )}

//                               <div className="relative">
//                                 <select
//                                   disabled={isUpdating || !candidate.email}
//                                   onChange={(e) => handleStatusChange(e.target.value)}
//                                   value={candidate.applicationStatus || ""}
//                                   className="appearance-none px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-xl shadow-md transition cursor-pointer pr-10 disabled:opacity-70 disabled:cursor-not-allowed"
//                                 >
//                                   <option value="" disabled>
//                                     {isUpdating ? "Updating..." : "Change Status"}
//                                   </option>
//                                   <option value="Shortlisted">Shortlisted</option>
//                                   <option value="Interview Scheduled">Interview Scheduled</option>
//                                   <option value="Technical Round">Technical Round</option>
//                                   <option value="HR Round">HR Round</option>
//                                   <option value="Offered">Offered</option>
//                                   <option value="Rejected">Rejected</option>
//                                   <option value="On Hold">On Hold</option>
//                                 </select>
//                                 <ChevronDown
//                                   className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
//                                   size={20}
//                                 />
//                                 {isUpdating && (
//                                   <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-white animate-spin" size={18} />
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Search,
  Building2,
  Calendar,
  Layers,
  CheckCircle,
  MapPin,
  Users,
  TrendingUp,
  X,
  Eye,
  Sparkles,
  ChevronDown,
  Loader2,
  User,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session?.user.role === "user") {
      router.push("/user/dashboard");
    }
  }, [session, status, router]);

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [filters, setFilters] = useState({ status: "", type: "" });
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  /* ================= AI STATES ================= */
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");

  // Track which candidates are being updated
  const [updatingStatuses, setUpdatingStatuses] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  /* ================= AI ANALYSIS WITH STATUS ENRICHMENT ================= */
  const runAIAnalysis = async (jobId) => {
    setAiLoading(true);
    setAiResult(null);
    setAiError("");
    setUpdatingStatuses({});

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "AI analysis failed");

      let parsedResult = JSON.parse(data.aiResult);

      // Fetch the actual job to get real application statuses
      const jobRes = await fetch(`/api/jobs/${jobId}`);
      if (!jobRes.ok) throw new Error("Failed to fetch job details");
      const jobData = await jobRes.json();

      // Enrich AI candidates with real application status
      const enrichedResult = parsedResult.map((candidate) => {
        const application = jobData.applications.find(
          (app) => app.userEmail.toLowerCase() === candidate.email.toLowerCase()
        );

        return {
          ...candidate,
          applicationStatus: application?.status || "pending",
        };
      });

      setAiResult(enrichedResult);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setSelectedJob(null);
      setSuccessMsg("Job deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const closeModals = () => {
    setSelectedJob(null);
    setAiResult(null);
    setAiError("");
    setUpdatingStatuses({});
  };

  /* ================= FILTERING & SORTING ================= */
  const applyFiltersAndSort = (jobsList) => {
    let filtered = jobsList.filter((job) => {
      const matchesSearch = `${job.title} ${job.company} ${job.location} ${job.skills?.join(" ")}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status ? job.status === filters.status : true;
      const matchesType = filters.type ? job.type === filters.type : true;
      return matchesSearch && matchesStatus && matchesType;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredAndSortedJobs = applyFiltersAndSort(jobs);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  if (status === "loading") return null;
  if (!session || session.user.role === "user") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

        {/* ================= HEADER ================= */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h3 className="text-4xl font-bold text-indigo-900 flex items-center justify-center gap-3">
            <Briefcase className="text-indigo-500" /> Job Management Dashboard
          </h3>
          <p className="mt-3 text-lg text-gray-600">View jobs and analyze applicants with AI</p>
        </motion.div>

        {/* ================= MESSAGES ================= */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-green-100 rounded-2xl text-green-800 flex items-center gap-2 shadow-md"
            >
              <CheckCircle /> {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-red-100 rounded-2xl text-red-800 flex items-center gap-2 shadow-md"
            >
              <X /> {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= FILTERS & SEARCH ================= */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
            <Search className="absolute right-4 top-4 text-gray-500" size={20} />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="px-6 py-4 rounded-2xl bg-white border border-indigo-200 text-gray-900 focus:outline-none focus:border-indigo-500 shadow-sm"
          >
            <option value="">All Types</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </motion.div>

        {/* ================= JOB TABLE ================= */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-indigo-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("title")}>
                    Title <ChevronDown size={16} className="inline" />
                  </th>
                  <th className="px-6 py-4 text-left cursor-pointer text-indigo-900" onClick={() => toggleSort("company")}>
                    Company <ChevronDown size={16} className="inline" />
                  </th>
                  <th className="px-6 py-4 text-left text-indigo-900">Status</th>
                  <th className="px-6 py-4 text-left text-indigo-900">Type</th>
                  <th className="px-6 py-4 text-left text-indigo-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {loadingJobs ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
                    </td>
                  </tr>
                ) : filteredAndSortedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedJobs.map((job) => (
                    <motion.tr
                      key={job._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-gray-900">{job.company}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{job.type}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => setSelectedJob(job)} className="p-2 rounded-full hover:bg-indigo-100 transition">
                          <Eye size={20} className="text-indigo-500" />
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="p-2 rounded-full hover:bg-indigo-100 transition">
                          <Trash2 size={20} className="text-red-500" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ================= VIEW MODAL ================= */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl max-w-5xl w-full p-10 overflow-y-auto max-h-[90vh] shadow-2xl border border-indigo-100"
              >
                <div className="flex justify-between mb-6">
                  <h2 className="text-3xl font-bold text-indigo-900">{selectedJob.title}</h2>
                  <button onClick={closeModals}>
                    <X size={28} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3 text-gray-900"><Building2 className="text-indigo-500" /><span>{selectedJob.company}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><MapPin className="text-indigo-500" /><span>{selectedJob.location}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><TrendingUp className="text-indigo-500" /><span>Salary: {selectedJob.salary || "N/A"}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><Layers className="text-indigo-500" /><span>Experience: {selectedJob.experience || "N/A"} years</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><Calendar className="text-indigo-500" /><span>Start: {selectedJob.startDate || "N/A"}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><Calendar className="text-indigo-500" /><span>End: {selectedJob.endDate || "N/A"}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><CheckCircle className="text-indigo-500" /><span>Status: {selectedJob.status}</span></div>
                  <div className="flex items-center gap-3 text-gray-900"><Users className="text-indigo-500" /><span>Type: {selectedJob.type}</span></div>
                </div>

                <p className="mb-6 text-gray-900">{selectedJob.description || "No description provided."}</p>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3 text-indigo-900">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.length > 0 ? (
                      selectedJob.skills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-indigo-100 rounded-full text-indigo-900">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No skills listed.</span>
                    )}
                  </div>
                </div>

                {/* ===== AI ANALYZE BUTTON ===== */}
                <button
                  onClick={() => runAIAnalysis(selectedJob._id)}
                  disabled={aiLoading}
                  className="w-full mb-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-lg flex justify-center gap-3 shadow-lg hover:shadow-teal-600/50 transition-shadow disabled:cursor-not-allowed"
                >
                  <Sparkles /> {aiLoading ? "Analyzing Applicants..." : "AI Analyze Applicants"}
                </button>

                {aiLoading && (
                  <div className="text-center py-6 text-indigo-600 font-semibold flex justify-center gap-3">
                    <Loader2 className="animate-spin" size={24} />
                    AI is analyzing candidates...
                  </div>
                )}

                {aiError && (
                  <div className="bg-red-100 p-4 rounded-xl text-red-800 mb-6">
                    {aiError}
                  </div>
                )}

                {/* ===== AI RESULTS ===== */}
                {aiResult && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4">AI Candidate Rankings</h3>
                    {aiResult.map((candidate, i) => {
                      const isUpdating = !!updatingStatuses[candidate.email];

                      const handleStatusChange = async (newStatus) => {
                        if (!newStatus || !candidate.email) return;

                        setUpdatingStatuses((prev) => ({ ...prev, [candidate.email]: true }));

                        try {
                          const res = await fetch("/api/jobs/update-application", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              jobId: selectedJob._id,
                              email: candidate.email,
                              status: newStatus,
                            }),
                          });

                          if (!res.ok) {
                            const data = await res.json();
                            throw new Error(data.message || "Failed to update status");
                          }

                          // Update local AI result
                          setAiResult((prev) =>
                            prev.map((c) =>
                              c.email.toLowerCase() === candidate.email.toLowerCase()
                                ? { ...c, applicationStatus: newStatus }
                                : c
                            )
                          );

                          setSuccessMsg(`Status updated to "${newStatus}" for ${candidate.name}`);
                          setTimeout(() => setSuccessMsg(""), 4000);
                        } catch (err) {
                          setErrorMsg(err.message);
                          setTimeout(() => setErrorMsg(""), 5000);
                        } finally {
                          setUpdatingStatuses((prev) => ({ ...prev, [candidate.email]: false }));
                        }
                      };

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border border-indigo-200 rounded-2xl p-6 shadow-md bg-gradient-to-br from-indigo-50/50 to-purple-50/30"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-indigo-900">#{i + 1} {candidate.name}</h4>
                              {candidate.email && <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>}
                            </div>
                            <span className="px-5 py-2 bg-indigo-600 text-white rounded-full font-bold text-lg">
                              {candidate.score}/100
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="font-semibold text-indigo-700">Strengths</p>
                              <p className="text-gray-700 mt-1">{candidate.strengths}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-indigo-700">Areas for Improvement</p>
                              <p className="text-gray-700 mt-1">{candidate.weaknesses}</p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="px-4 py-2 bg-teal-100 text-teal-900 rounded-full font-medium">
                                {candidate.finalVerdict}
                              </span>

                              <span className={`px-4 py-2 rounded-full text-sm font-medium ${candidate.applicationStatus === "accepted" ? "bg-green-100 text-green-800" :
                                  candidate.applicationStatus === "rejected" ? "bg-red-100 text-red-800" :
                                    candidate.applicationStatus === "reviewed" ? "bg-blue-100 text-blue-800" :
                                      "bg-yellow-100 text-yellow-800"
                                }`}>
                                {candidate.applicationStatus.charAt(0).toUpperCase() + candidate.applicationStatus.slice(1)}
                              </span>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                              {candidate.email && (
                                <Link
                                  href={`/profile?email=${encodeURIComponent(candidate.email)}`}
                                  target="_blank"
                                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition flex items-center gap-2 flex-1 sm:flex-initial justify-center"
                                >
                                  <User className="w-5 h-5" />
                                  View Profile
                                </Link>
                              )}

                              {/* <div className="relative">
                                <select
                                  disabled={isUpdating || !candidate.email}
                                  onChange={(e) => handleStatusChange(e.target.value)}
                                  value={candidate.applicationStatus || "pending"}
                                  className="appearance-none px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium rounded-xl shadow-md transition cursor-pointer pr-10 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={20} />
                                {isUpdating && (
                                  <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-white animate-spin" size={18} />
                                )}
                              </div>

                               */}


                              <div className="relative">
                                <select
                                  disabled={isUpdating || !candidate.email}
                                  onChange={(e) => handleStatusChange(e.target.value)}
                                  value={candidate.applicationStatus || "pending"}
                                  className="appearance-none px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-gray-900 font-semibold rounded-xl shadow-md transition cursor-pointer pr-10 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="accepted">Accepted</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 pointer-events-none" size={20} />
                                {isUpdating && (
                                  <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-900 animate-spin" size={18} />
                                )}
                              </div>


                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}