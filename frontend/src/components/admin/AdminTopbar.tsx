type AdminTopbarProps = {
    onMenuClick: () => void;
    role: string;
  };
  
  export default function AdminTopbar({
    onMenuClick,
    role,
  }: AdminTopbarProps) {
    return (
      <header className="admin-topbar">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-light d-lg-none"
            onClick={onMenuClick}
            aria-label="Open admin menu"
          >
            ☰
          </button>
  
          <div>
            <h5 className="mb-0 fw-bold">
              Recovery+ Administration
            </h5>
  
            <small className="text-muted">
              Platform management and insights
            </small>
          </div>
        </div>
  
        <div className="d-flex align-items-center gap-3">
          <span className="badge rounded-pill text-bg-dark">
            {role}
          </span>
  
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{
              width: "40px",
              height: "40px",
              background: "#173f35",
              color: "#fff",
            }}
          >
            SA
          </div>
        </div>
      </header>
    );
  }