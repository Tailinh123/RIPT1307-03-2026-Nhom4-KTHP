import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import AppRoutes from '@/routes/AppRoutes';

const App: React.FC = () => (
  <ConfigProvider locale={viVN}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ConfigProvider>
);


export default App;
