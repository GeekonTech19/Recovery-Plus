type AdminStatCardProps = {
    title: string;
    value: number;
    icon: string;
    description?: string;
  };
  
  export default function AdminStatCard({
    title,
    value,
    icon,
    description,
  }: AdminStatCardProps) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p className="text-muted mb-2 small">{title}</p>
  
              <h2 className="fw-bold mb-1">
                {value.toLocaleString()}
              </h2>
  
              {description && (
                <small className="text-muted">
                  {description}
                </small>
              )}
            </div>
  
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
                background: "#eef5f1",
                fontSize: "22px",
              }}
            >
              {icon}
            </div>
          </div>
        </div>
      </div>
    );
  }