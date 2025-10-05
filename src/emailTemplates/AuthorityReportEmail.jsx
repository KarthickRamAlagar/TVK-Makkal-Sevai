// import {
//   Html,
//   Head,
//   Body,
//   Container,
//   Section,
//   Heading,
//   Text,
//   Img,
//   Hr,
// } from "@react-email/components";

// export default function AuthorityReportEmail() {
//   const credentials = [
//     { icon: "👤", label: "Authority Name", value: "Amma", color: "#ef4444" },
//     {
//       icon: "📍",
//       label: "Authorized District",
//       value: "Madurai",
//       color: "#22c55e",
//     },
//     {
//       icon: "🆔",
//       label: "Authority ID",
//       value: "tvkmadurai573",
//       color: "#3b82f6",
//     },
//     {
//       icon: "✉️",
//       label: "Email",
//       value: (
//         <a
//           href="mailto:tvkmadurai@gmail.com"
//           style={{ color: "#2563eb", textDecoration: "underline" }}
//         >
//           tvkmadurai@gmail.com
//         </a>
//       ),
//       color: "#f59e0b",
//     },
//     {
//       icon: "🛡️",
//       label: "Role",
//       value: "district_Authority",
//       color: "#a855f7",
//     },
//   ];

//   const metrics = [
//     { label: "EFFICIENCY", value: "100%", color: "#3b82f6" },
//     { label: "RESOLVED", value: "4", color: "#22c55e" },
//     { label: "PENDING", value: "0", color: "#facc15" },
//     { label: "REAPPEALED", value: "0", color: "#a855f7" },
//     { label: "REJECTED", value: "0", color: "#ef4444" },
//   ];

//   const renderCards = () => {
//     const rows = [];
//     for (let i = 0; i < metrics.length; i += 2) {
//       const rowItems = metrics.slice(i, i + 2);
//       rows.push(
//         <div
//           key={i}
//           style={{
//             display: "flex",
//             justifyContent: rowItems.length === 1 ? "center" : "space-between",
//             alignItems: "center",
//             marginBottom: "20px",
//           }}
//         >
//           {rowItems.map((item, idx) => (
//             <div
//               key={idx}
//               style={{
//                 backgroundColor: item.color,
//                 borderRadius: "12px",
//                 padding: "16px",
//                 width: "45%",
//                 textAlign: "center",
//                 color: "white",
//                 fontWeight: "bold",
//               }}
//             >
//               <div style={{ fontSize: "14px" }}>{item.label}</div>
//               <div style={{ fontSize: "24px" }}>{item.value}</div>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return rows;
//   };

//   return (
//     <Html>
//       <Head />
//       <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
//         <Container style={{ padding: "20px", margin: "0 auto" }}>
//           {/* 1️⃣ Header Section */}
//           <Section
//             style={{
//               background: "linear-gradient(to right, #f87171, #facc15)",
//               padding: "20px",
//               textAlign: "center",
//             }}
//           >
//             <Heading
//               style={{
//                 fontSize: "32px",
//                 fontWeight: "bold",
//                 color: "red",
//                 WebkitTextStroke: "1px white",
//                 fontFamily: "serif",
//               }}
//             >
//               தமிழக வெற்றிக் கழகம்
//             </Heading>
//           </Section>

//           {/* 2️⃣ Tamil Tagline Section */}
//           <Section style={{ marginTop: "24px", textAlign: "center" }}>
//             <Heading
//               style={{
//                 fontSize: "28px",
//                 fontWeight: "800",
//                 color: "#dc2626",
//                 WebkitTextStroke: "1px white",
//                 fontFamily: "serif",
//               }}
//             >
//               பிறப்பொக்கும் எல்லா உயிர்க்கும்
//             </Heading>
//           </Section>

//           {/* 3️⃣ Intro Paragraph Section */}
//           <Section style={{ marginTop: "24px", padding: "0 12px" }}>
//             <Text
//               style={{
//                 fontSize: "16px",
//                 lineHeight: "1.6",
//                 fontWeight: 600,
//                 color: "#333",
//               }}
//             >
//               This report provides an overview of your <b>efficiency</b> and{" "}
//               <b>leadership qualities</b>. It reflects how you approach people
//               while upholding our <b>principles, vision, and mission</b>.
//               <br />
//               <br />
//               Along with your <b>contributions</b>, it highlights measurable
//               outcomes in both <b>numbers and visuals</b>. Together, these
//               insights represent your continued commitment to{" "}
//               <b>service excellence</b> with your <b>district statistics</b> and{" "}
//               <b>your credentials</b>.
//             </Text>
//           </Section>

//           {/* 4️⃣ Authority Credentials Section */}
//           <Section style={{ marginTop: "32px", padding: "0 12px" }}>
//             <Heading style={{ fontSize: "22px", fontWeight: "bold" }}>
//               Authority Credentials
//             </Heading>
//             <div style={{ marginTop: "16px" }}>
//               {credentials.map((item, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "12px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "20px",
//                       marginRight: "12px",
//                       color: item.color,
//                     }}
//                   >
//                     {item.icon}
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "bold",
//                         color: item.color,
//                       }}
//                     >
//                       {item.label}
//                     </div>
//                     <div style={{ fontSize: "16px", color: "#333" }}>
//                       {item.value}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Section>

//           {/* 5️⃣ Efficiency Insights Section */}
//           <Section style={{ marginTop: "32px", padding: "0 12px" }}>
//             <Heading style={{ fontSize: "22px", fontWeight: "bold" }}>
//               Let's know your Efficiency
//             </Heading>
//             <div style={{ marginTop: "16px" }}>{renderCards()}</div>
//           </Section>

//           {/* 6️⃣ Donut Chart Section */}
//           <Section style={{ marginTop: "32px", textAlign: "center" }}>
//             <Img
//               src="cid:donut_chart"
//               alt="Efficiency Donut Chart"
//               width="200"
//               height="200"
//               style={{ margin: "0 auto" }}
//             />
//           </Section>

//           {/* 7️⃣ Footer Section */}
//           <Hr style={{ margin: "32px 0" }} />
//           <Section style={{ textAlign: "center", padding: "12px" }}>
//             <Text
//               style={{ fontSize: "16px", fontWeight: "bold", color: "red" }}
//             >
//               With Regards,
//             </Text>
//             <Text
//               style={{ fontSize: "18px", fontWeight: "bold", color: "#ca8a04" }}
//             >
//               தமிழக வெற்றிக் கழகம்
//             </Text>
//             <Img
//               src="cid:party_flag"
//               alt="Party Flag"
//               width="60"
//               height="40"
//               style={{ objectFit: "contain", marginTop: "8px" }}
//             />
//           </Section>
//         </Container>
//       </Body>
//     </Html>
//   );
// }

// src/emailTemplates/AuthorityReportEmail.jsx

import React from "react";

export default function AuthorityReportEmail({
  authorityData = {},
  allComplaints = [],
  selectedRange = "This Month",
  donutChartImageBase64,
}) {
  const {
    userName = "Authority Officer",
    email = "authority@example.com",
    whatsapp = "N/A",
    district = "Unknown District",
  } = authorityData;

  // Example metrics
  const total = allComplaints.length;
  const resolved = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;
  const reAppealed = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "reappealed"
  ).length;
  const rejected = allComplaints.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Efficiency Report</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "Arial, sans-serif" }}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#f4f4f5", padding: "20px" }}
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                {/* Header */}
                <tr>
                  <td align="center" style={{ paddingBottom: "20px" }}>
                    <h2 style={{ margin: 0, color: "#111827" }}>
                      Efficiency Report
                    </h2>
                    <p style={{ margin: 0, color: "#6b7280" }}>
                      {selectedRange}
                    </p>
                  </td>
                </tr>

                {/* Authority Info */}
                <tr>
                  <td>
                    <h3 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                      {userName}
                    </h3>
                    <p style={{ margin: "5px 0", color: "#6b7280" }}>
                      📍 District: {district}
                    </p>
                    <p style={{ margin: "5px 0", color: "#6b7280" }}>
                      📱 WhatsApp: {whatsapp}
                    </p>
                    <p style={{ margin: "5px 0", color: "#6b7280" }}>
                      ✉️ Email:{" "}
                      <a
                        href={`mailto:${email}`}
                        style={{
                          color: "#2563eb",
                          textDecoration: "underline",
                        }}
                      >
                        {email}
                      </a>
                    </p>
                  </td>
                </tr>

                {/* Chart Section */}
                {donutChartImageBase64 && (
                  <tr>
                    <td align="center" style={{ padding: "20px 0" }}>
                      <img
                        src={donutChartImageBase64}
                        alt="Efficiency Chart"
                        width="250"
                        style={{ display: "block", borderRadius: "8px" }}
                      />
                    </td>
                  </tr>
                )}

                {/* Stats */}
                <tr>
                  <td>
                    <table
                      width="100%"
                      cellPadding="8"
                      cellSpacing="0"
                      style={{
                        borderCollapse: "collapse",
                        marginTop: "10px",
                      }}
                    >
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td>Total Complaints</td>
                        <td align="right">{total}</td>
                      </tr>
                      <tr>
                        <td>Resolved</td>
                        <td align="right">{resolved}</td>
                      </tr>
                      <tr style={{ backgroundColor: "#f9fafb" }}>
                        <td>Re-Appealed</td>
                        <td align="right">{reAppealed}</td>
                      </tr>
                      <tr>
                        <td>Rejected</td>
                        <td align="right">{rejected}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td align="center" style={{ paddingTop: "20px" }}>
                    <p
                      style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}
                    >
                      This report was generated automatically by{" "}
                      <strong>தமிழக வெற்றிக் கழகம்</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
