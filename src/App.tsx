import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import AppRoutes from '@/routes/AppRoutes';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    colorBgBase: '#ffffff',
    borderRadius: 8,
    fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 14,
    colorText: '#1d1d1f',
    colorTextSecondary: '#595959',
    colorBorder: '#e8eaed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  components: {
    Menu: {
      itemSelectedBg: '#e6f4ff',
      itemSelectedColor: '#1677ff',
      itemHoverBg: '#f5f7ff',
      itemBorderRadius: 8,
      itemMarginInline: 4,
    },
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 14,
    },
    Select: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={viVN} theme={theme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
