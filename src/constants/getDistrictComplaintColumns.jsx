import getStatusStyle from "@/utils/getStatusStyle";

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const normalizeTaluk = (taluk) =>
  taluk?.toLowerCase().replace(/\s+/g, " ").trim();

export const getDistrictComplaintColumns = ({
  setAlertMessage,
  setShowAlert,
  districtName,
  setSelectedStatusComplaint,
  openProofsModal, // ✅ added
}) => [
  {
    key: "complaintId",
    header: "Complaint ID",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-semibold text-center max-w-[180px] truncate",
    cell: (row) => (
      <span
        className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-yellow-600 font-bold"
        onMouseEnter={() => {
          setAlertMessage(`complaint Id: ${row.complaintId}`);
          setShowAlert(true);
        }}
        onMouseLeave={() => setShowAlert(false)}
      >
        {row.complaintId}
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 text-center",
    cell: (row) => {
      if (!row.date) return "—";
      const d = new Date(row.date);
      const formattedDate = d.toLocaleDateString("en-GB");
      return <span className="text-blue-600 font-medium">{formattedDate}</span>;
    },
  },
  {
    key: "taluk",
    header: "Taluk",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-semibold text-start max-w-[150px]",
    cell: (row) => {
      const rawTaluk = normalizeTaluk(row.taluk);
      const district = normalizeTaluk(districtName);
      const directions = ["north", "south", "east", "west"];

      const matchedDirection = directions.find((dir) => {
        const fullTaluk = `${district} ${dir}`;
        return rawTaluk === dir || rawTaluk === fullTaluk;
      });

      const displayTaluk =
        matchedDirection && district
          ? `${capitalize(district)} ${capitalize(matchedDirection)}`
          : row.taluk?.trim() || "😕 Unknown Taluk";

      return <span className="text-green-600">{displayTaluk}</span>;
    },
  },
  {
    key: "wardNo",
    header: "Ward No",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-bold text-center max-w-[100px] truncate",
    cell: (row) => <span className="text-violet-600">{row.wardNo}</span>,
  },
  {
    key: "department",
    header: "Department",
    thClassName: "py-5 px-6 pl-0",
    tdClassName: "py-5 px-6 font-semibold text-start max-w-[200px] truncate",
    cell: (row) => (
      <span
        className="text-yellow-600 cursor-pointer"
        onMouseEnter={() => {
          setAlertMessage(`Department: ${row.department}`);
          setShowAlert(true);
        }}
        onMouseLeave={() => setShowAlert(false)}
      >
        {row.department}
      </span>
    ),
  },
  {
    key: "userName",
    header: "User Name",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-semibold text-center max-w-[200px] truncate",
    cell: (row) => <span className="text-blue-600">{row.userName}</span>,
  },
  {
    key: "userId",
    header: "User Id",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-semibold text-center max-w-[200px] truncate",
    cell: (row) => <span className="text-orange-500">{row.userId}</span>,
  },
  {
    key: "email",
    header: "Email",
    thClassName: "py-5 px-6 pl-2",
    tdClassName: "py-5 px-6 font-semibold text-center max-w-[200px] truncate",
    cell: (row) => <span className="text-blue-600">{row.email}</span>,
  },
  {
    key: "userFeedback",
    header: "User Feedback",
    thClassName: "py-5 px-6",
    tdClassName: "py-5 px-6 text-center",
    cell: (row) => {
      const feedback = row.userFeedback;

      let displayText = (
        <span className="text-gray-400 italic">Yet To Receive Feedback</span>
      );
      let alertText = " Yet to receive the feedback.";

      if (feedback?.satisfied) {
        displayText = (
          <span className="text-yellow-500 font-bold">Satisfied</span>
        );
        alertText = " Eager to view the feedback? Then click it.";
      } else if (feedback?.reason) {
        displayText = (
          <span className="text-red-500 font-bold">Not Satisfied</span>
        );
        alertText = " Not satisfied — click to view";
      }

      return (
        <span
          onMouseEnter={() => {
            setAlertMessage(alertText);
            setShowAlert(true);
          }}
          onMouseLeave={() => setShowAlert(false)}
        >
          {displayText}
        </span>
      );
    },
  },
  {
    key: "proofs",
    header: "Proofs",
    thClassName: "py-5 px-6",
    tdClassName: "py-5 px-6 text-center",
    cell: (row) => (
      <button
        className="text-gray-500 hover:text-gray-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          if (row?.proofs) {
            setAlertMessage("Opening attached proofs...");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 1500);
            openProofsModal(row); // ✅ clean trigger
          } else {
            setAlertMessage("No proofs submitted for this complaint.");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }
        }}
        title="View Proofs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 inline-block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 17L17 7M7 7h10v10"
          />
        </svg>
      </button>
    ),
  },
  {
    key: "status",
    header: "Status",
    thClassName: "py-5 px-6",
    tdClassName: "py-5 px-6",
    cell: (row) => {
      const status = row.status;
      const displayStatus =
        status === "FeedbackPending" ? "Waiting for User Feedback" : status;

      return (
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full shadow-md cursor-pointer ${getStatusStyle(status)}`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStatusComplaint(row);
          }}
        >
          {displayStatus || "—"}
        </span>
      );
    },
  },
];
