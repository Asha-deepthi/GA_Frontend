import React from 'react';
import { useNavigate } from 'react-router-dom'; 
function Positions() {
    const navigate = useNavigate();
  console.log("Positions component is rendering") // Debug log

  const positions = [
    {
      id: 1,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
    {
      id: 2,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
    {
      id: 3,
      title: "Senior Digital Media Planner",
      description:
        "Work closely with agencies to develop strategies and integrated media planning to deliver measurable, impactful media plans and creative that deliver results and...",
      applications: 20,
      noResponse: 12,
      pending: 7,
      declined: 0,
      hired: 1,
    },
  ]

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          {/* Left side */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div
              style={{
                width: "64px",
                height: "32px",
                backgroundColor: "#d1d5db",
                borderRadius: "4px",
              }}
            ></div>
            <nav style={{ display: "flex", gap: "32px" }}>
              <a
                href="#"
                style={{
                  color: "#6b7280",
                  textDecoration: "none",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Home
              </a>
              <a
                href="#"
                style={{
                  color: "#6b7280",
                  textDecoration: "none",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Evaluations
              </a>
              <a
                href="#"
                style={{
                  color: "#0d9488",
                  textDecoration: "none",
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  borderBottom: "2px solid #0d9488",
                }}
              >
                Positions
              </a>
            </nav>
          </div>

          {/* Right side */}
 <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          style={{
            backgroundColor: "#0d9488",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
          // 3. Add the onClick handler to call the navigate function
          onClick={() => navigate('/importform')}
        >
          Create a Test
        </button>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "#f3f4f6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              JD
            </div>
            <span style={{ fontSize: "14px", color: "#374151" }}>Jane Doe</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 20px",
        }}
      >
        {positions.map((position) => (
          <div
            key={position.id}
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "32px",
              }}
            >
              {/* Left content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: "0 0 8px 0",
                  }}
                >
                  {position.title}
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    margin: 0,
                    maxWidth: "500px",
                  }}
                >
                  {position.description}
                </p>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "48px",
                  flexShrink: 0,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {position.applications}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Applications
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {position.noResponse}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    No Response
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {position.pending}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Pending
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {position.declined}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Declined
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#111827",
                    }}
                  >
                    {position.hired}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Hired
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Positions