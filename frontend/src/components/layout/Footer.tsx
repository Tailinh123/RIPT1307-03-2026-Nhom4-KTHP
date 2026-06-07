import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import {
  ArrowUpOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import logoInternMatch from '@/assets/images/logo-internmatch.png';
const { Text } = Typography;
const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <>
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 32px 24px', marginTop: 64 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 32,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src={logoInternMatch}
                alt="InternMatching"
                style={{
                  height: 72,
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: 10,
                  background: '#ffffff',
                  padding: '8px 12px',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                }}
              />
            </div>
            <Text style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 13 }}>
              Nền tảng kết nối ứng viên với cơ hội việc làm hấp dẫn tại các doanh nghiệp hàng đầu Việt Nam.
            </Text>
          </div>
          <div>
            <Text strong style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontSize: 14 }}>
              Dành cho ứng viên
            </Text>
            {['Tìm việc làm', 'Tạo hồ sơ', 'Lịch sử ứng tuyển'].map((text) => (
              <div key={text} className="footer-link" style={{ padding: '6px 0', fontSize: 13, display: 'inline-block', width: '100%' }}>
                {text}
              </div>
            ))}
          </div>
          <div>
            <Text strong style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontSize: 14 }}>
              Dành cho nhà tuyển dụng
            </Text>
            {['Đăng tin tuyển dụng', 'Quản lý ứng viên', 'Dashboard công ty'].map((text) => (
              <div key={text} className="footer-link" style={{ padding: '6px 0', fontSize: 13, display: 'inline-block', width: '100%' }}>
                {text}
              </div>
            ))}
          </div>
          <div>
            <Text strong style={{ color: '#e2e8f0', display: 'block', marginBottom: 12, fontSize: 14 }}>
              Liên hệ
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MailOutlined /> linhfunny2@gmail.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhoneOutlined /> 0865340731
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <EnvironmentOutlined /> 36 Tố Hữu, Hà Đông, Hà Nội
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {[
                { icon: <FacebookOutlined />, url: 'https://www.facebook.com/nguyentailinh.06?locale=vi_VN' },
                { icon: <LinkedinOutlined />, url: '#' },
                { icon: <GithubOutlined />, url: '#' }
              ].map(({ icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target={url !== '#' ? "_blank" : undefined}
                  rel={url !== '#' ? "noopener noreferrer" : undefined}
                  className="social-icon"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    color: '#94a3b8',
                    textDecoration: 'none'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            borderTop: '1px solid #1e293b',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            fontSize: 12,
          }}
        >
          <Text style={{ color: '#64748b' }}>© 2026 InternMatch - Nhóm 4 RIPT1307. All rights reserved.</Text>
          <div style={{ display: 'flex', gap: 16 }}>
            <span className="footer-link" style={{ fontSize: 12, display: 'inline-block' }}>Chính sách bảo mật</span>
            <span className="footer-link" style={{ fontSize: 12, display: 'inline-block' }}>Điều khoản sử dụng</span>
          </div>
        </div>
      </footer>
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Về đầu trang">
          <ArrowUpOutlined />
        </button>
      )}
    </>
  );
};
export default Footer;
