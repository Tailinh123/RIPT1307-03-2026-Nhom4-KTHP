import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '@/api/axiosClient';
interface TickerStats {
  totalJobs: number;
  totalCompanies: number;
}
const INTERVAL_MS = 3000;
const HeroTicker: React.FC = () => {
  const [stats, setStats] = useState<TickerStats>({ totalJobs: 0, totalCompanies: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0); 
  useEffect(() => {
    const fetchStats = async () => {
      const results = await Promise.allSettled([
        axiosClient.get('/api/v1/jobs', { params: { page: 1, size: 1 } }),
        axiosClient.get('/api/v1/companies', { params: { page: 1, size: 1 } }),
      ]);
      const getTotal = (res: PromiseSettledResult<any>): number => {
        if (res.status !== 'fulfilled') return 0;
        return (
          res.value?.data?.data?.meta?.total ??
          res.value?.data?.data?.result?.length ??
          0
        );
      };
      setStats({
        totalJobs: getTotal(results[0]),
        totalCompanies: getTotal(results[1]),
      });
    };
    fetchStats();
  }, []);
  const messages = [
    `+${stats.totalCompanies.toLocaleString('vi-VN')} CÔNG TY ĐANG TUYỂN`,
    `+${stats.totalJobs.toLocaleString('vi-VN')} VIỆC LÀM MỚI HÔM NAY`,
    `+${stats.totalJobs.toLocaleString('vi-VN')} VIỆC LÀM ĐANG TUYỂN`,
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % messages.length);
      setAnimKey((prev) => prev + 1);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [messages.length]);
  return (
    <>
      <style>{`
        @keyframes tickerSlideUp {
          0%   { transform: translateY(100%); opacity: 0; }
          12%  { transform: translateY(0);    opacity: 1; }
          85%  { transform: translateY(0);    opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .hero-ticker {
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          height: 1.5em;           /* điều chỉnh theo font‑size của bạn */
          line-height: 1.5em;
        }
        .hero-ticker__inner {
          display: flex;
          align-items: center;
          gap: 0.35em;
          white-space: nowrap;
        }
        .hero-ticker__fixed {
          /* "CÓ" luôn hiển thị, không di chuyển */
          flex-shrink: 0;
        }
        .hero-ticker__slider {
          position: relative;
          overflow: hidden;
          height: 1.5em;
          display: flex;
          align-items: center;
        }
        .hero-ticker__slide {
          /* key thay đổi → element re‑mount → animation chạy lại từ đầu */
          animation: tickerSlideUp ${INTERVAL_MS}ms ease forwards;
          display: inline-block;
          will-change: transform, opacity;
        }
      `}</style>
      <div className="hero-ticker">
        <div className="hero-ticker__inner">
          <span className="hero-ticker__fixed">CÓ</span>
          <div className="hero-ticker__slider">
            <span className="hero-ticker__slide" key={animKey}>
              {messages[activeIndex]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default React.memo(HeroTicker);
