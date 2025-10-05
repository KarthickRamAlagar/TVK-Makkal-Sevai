import { render } from "@react-email/render";
import emailjs from "@emailjs/browser";
import AuthorityReportEmail from "../emailTemplates/AuthorityReportEmail";

// 🧠 Accept dynamic data from AuthorityEfficiency page
export async function sendEfficiencyReport({
  toEmail = "karthickramalagar@gmail.com",
  authorityData,
  allComplaints,
  selectedRange,
  donutChartImageBase64, // optional: base64 image string
}) {
  const fromName = "Tamilaga Vettri Kazhagam";
  const replyTo = "tvk.makkasevai@gmail.com";

  // ✅ MUST await render, or you'll get [object Object]
  const html = await render(
    <AuthorityReportEmail
      authorityData={authorityData}
      allComplaints={allComplaints}
      selectedRange={selectedRange}
      donutChartImageBase64={donutChartImageBase64}
    />
  );

  console.log("📤 Sending Efficiency Report Email");
  console.log("🔸 To:", toEmail);
  console.log("🔸 Range:", selectedRange);
  console.log("🔸 Complaints:", allComplaints.length);
  console.log("🔸 Authority:", authorityData?.userName);

  try {
    const response = await emailjs.send(
      "service_jwx5pnq",
      "template_vlb01qs",
      {
        from_name: fromName,
        reply_to: replyTo,
        to_email: toEmail,
        html_message: html, // ✅ This is full HTML string now
      },
      "bsmqp3IdCyn5uDBOn"
    );

    console.log("✅ EmailJS Response:", response);

    // 🔔 Play success sound
    const successAudio = new Audio("/ding.mp3");
    successAudio.play().catch((err) => {
      console.warn("⚠️ Unable to play success sound:", err);
    });
  } catch (error) {
    console.error("❌ EmailJS Send Error:", error);

    // ❌ Play error sound
    const errorAudio = new Audio("/error.mp3");
    errorAudio.play().catch((err) => {
      console.warn("⚠️ Unable to play error sound:", err);
    });

    throw error;
  }
}
