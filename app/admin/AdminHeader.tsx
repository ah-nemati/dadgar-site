
import type { ReactNode } from 'react';

export default function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="dashboard-page-header">
      <div>
        <h1 className="dashboard-page-title">{title}</h1>
        {description && <p className="dashboard-page-description">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
