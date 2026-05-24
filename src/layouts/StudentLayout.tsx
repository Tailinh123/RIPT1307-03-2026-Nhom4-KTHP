import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderBar from '@/components/layout/HeaderBar';

const StudentLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa' }}>
      {/* Fixed top header */}
      <HeaderBar />

      {/* Page content — push down by header height */}
      <div
        style={{
          paddingTop: 64,
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '28px 32px',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
