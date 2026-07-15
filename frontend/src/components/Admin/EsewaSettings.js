import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";

const EsewaSettings = () => {
  const alert = useAlert();

  const [esewaNumber, setEsewaNumber] = useState("");
  const [qrPreview, setQrPreview] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQR, setCurrentQR] = useState(null);

  // Load existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/v1/settings");
        if (data.settings.esewaQR?.url) setCurrentQR(data.settings.esewaQR.url);
        if (data.settings.esewaNumber)
          setEsewaNumber(data.settings.esewaNumber);
      } catch (err) {}
    };
    fetchSettings();
  }, []);

  const handleQRChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setQrFile(file);

    const reader = new FileReader();
    reader.onload = () => setQrPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const payload = { esewaNumber };

      if (qrFile) {
        // Convert to base64 for Cloudinary upload (same pattern as class images)
        const reader = new FileReader();
        reader.readAsDataURL(qrFile);
        reader.onload = async () => {
          payload.esewaQR = reader.result;
          const { data } = await axios.put(
            "/api/v1/admin/settings",
            payload,
            config,
          );
          setCurrentQR(data.settings.esewaQR.url);
          alert.success("eSewa settings updated!");
          setQrFile(null);
          setQrPreview(null);
          setLoading(false);
        };
        return;
      }

      await axios.put("/api/v1/admin/settings", payload, config);
      alert.success("eSewa settings updated!");
    } catch (err) {
      alert.error(err.response?.data?.message || "Update failed");
    } finally {
      if (!qrFile) setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="eSewa Settings — Admin" />
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <h1 className="admin-title">⚡ eSewa Settings</h1>

          <div
            style={{
              maxWidth: 520,
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {currentQR && (
              <div style={{ marginBottom: 24, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
                  Current QR Code
                </p>
                <img
                  src={currentQR}
                  alt="Current eSewa QR"
                  style={{
                    width: 180,
                    height: 180,
                    objectFit: "contain",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 8,
                  }}
                />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  eSewa Phone Number / ID
                </label>
                <input
                  type="text"
                  value={esewaNumber}
                  onChange={(e) => setEsewaNumber(e.target.value)}
                  placeholder="e.g. 9800000000"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1.5px solid #ddd",
                    borderRadius: 6,
                    fontSize: 15,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Upload QR Code Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRChange}
                  style={{ fontSize: 14 }}
                />
                {qrPreview && (
                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    <img
                      src={qrPreview}
                      alt="QR Preview"
                      style={{
                        width: 160,
                        height: 160,
                        objectFit: "contain",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        padding: 8,
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "#ccc" : "#E63946",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EsewaSettings;
