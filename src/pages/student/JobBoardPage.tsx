import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Typography } from 'antd';
import { useJobs } from '@/hooks/useJobs';
import CategoryGrid from '@/components/job/CategoryGrid';
import JobFilter from '@/components/job/JobFilter';
import JobList from '@/components/job/JobList';
import StatsBanner from '@/components/job/StatsBanner';
import TopCompanies from '@/components/job/TopCompanies';
import HeroTicker from '@/components/job/HeroTicker';
import type { JobFilterParams } from '@/types/job';
const { Title, Text } = Typography;
const HeroTypedWord: React.FC<{ words: string[] }> = React.memo(({ words }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentWord = words[wordIndex % words.length] || '';
  useEffect(() => {
    setWordIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
  }, [words]);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentWord.length) {
          setCharIndex(charIndex + 1);
        } else {
          window.setTimeout(() => setIsDeleting(true), 1500);
        }
        return;
      }
      if (charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else {
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }, isDeleting ? 50 : 100);
    return () => window.clearTimeout(timeout);
  }, [charIndex, currentWord, isDeleting, wordIndex, words.length]);
  return <>{currentWord.substring(0, charIndex)}</>;
});
const JobBoardPage: React.FC = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const { jobs, total, loading, error, filters, setFilters, page, setPage } = useJobs();
  const typingWords = useMemo(() => {
    const jobTitles = jobs.map((job) => job.title).filter(Boolean).slice(0, 5);
    return jobTitles.length ? jobTitles : ['vi tri phu hop'];
  }, [jobs]);
  const displayText = <HeroTypedWord words={typingWords} />;
  return (
    <div className="page-enter" style={{ background: '#f5f6fa', minHeight: 'calc(100vh - 64px)' }}>
      <section
        className="hero-section"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: 0,
          position: 'relative',
          backgroundImage: 'url(/images/banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
          minHeight: 270,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,20,53,0.46) 0%, rgba(10,61,143,0.30) 48%, rgba(2,20,53,0.58) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            margin: '0 auto',
            padding: '42px 32px 96px',
            textAlign: 'center',
          }}
        >
          <Title
            level={1}
            style={{
              color: '#ffffff',
              margin: 0,
              marginBottom: 8,
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1.14,
              textShadow: '0 3px 16px rgba(0,0,0,0.28)',
            }}
          >
            Khám phá cơ hội nghề nghiệp phù hợp với bạn
          </Title>
          <div
            style={{
              color: 'rgba(255,255,255,0.92)',
              fontSize: 'clamp(16px, 1.6vw, 20px)',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minHeight: 32,
            }}
          >
            Tìm vị trí <span style={{ color: '#69dbff', fontWeight: 700 }}>{displayText}</span>
            <span className="typing-cursor" />
          </div>
          <Text
            style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: 'clamp(13px, 1.2vw, 15px)',
              display: 'block',
              marginTop: 8,
              letterSpacing: 0,
            }}
          >
            Dễ dàng tìm kiếm, so sánh và ứng tuyển vào những công việc phù hợp với bạn.
          </Text>
        </div>
        <HeroTicker />
      </section>
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(16px, 4vw, 28px) 44px' }}>
        <div ref={topRef} style={{ scrollMarginTop: '80px', maxWidth: 860, margin: '-56px auto 26px', position: 'relative', zIndex: 5 }}>
          <JobFilter filters={filters} onChange={(nextFilters: JobFilterParams) => setFilters(nextFilters)} loading={loading} />
        </div>
        <StatsBanner />
        <JobList jobs={jobs} total={total} loading={loading} error={error} page={page} pageSize={12} onPageChange={setPage} onClearFilters={Object.keys(filters).length > 0 ? () => setFilters({}) : undefined} />
        <CategoryGrid onSelectCategory={(categoryId) => {
          setFilters({ ...filters, categoryId });
          topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }} />
        <TopCompanies />
      </main>
    </div>
  );
};
export default JobBoardPage;
