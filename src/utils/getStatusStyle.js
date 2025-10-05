export default function getStatusStyle(status = "") {
  switch ((status || "").toLowerCase()) {
    case "appealed":
    case "reappealed":
      return "bg-yellow-400 text-black";
    case "pending":
      return "bg-red-500 text-white";
    case "feedbackpending": //New intermediate status
      return "bg-yellow-300 text-black"; // Soft yellow for "waiting"
    case "resolved":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-gray-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}
