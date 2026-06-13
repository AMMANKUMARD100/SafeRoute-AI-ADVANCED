// client/src/sosService.js

// ✅ This function will be called when stress is detected
export async function sendSOS() {
  try {
    // Example: call your backend API route for SOS
    const response = await fetch("/api/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "🚨 Stress detected! SOS alert triggered.",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send SOS alert");
    }

    console.log("SOS alert sent successfully!");
  } catch (err) {
    console.error("SOS error:", err);
  }
}
