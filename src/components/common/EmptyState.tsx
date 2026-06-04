import React from 'react';
import { Button, Typography } from 'antd';
const { Text } = Typography;
const SearchPersonSVG: React.FC = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="130" rx="70" ry="8" fill="#e6f4ff" opacity="0.6" />
    <circle cx="72" cy="52" r="18" fill="#d6e4ff" />
    <circle cx="72" cy="52" r="14" fill="#e6f4ff" />
    <circle cx="72" cy="48" r="5" fill="#1677ff" opacity="0.7" />
    <path d="M56 76C56 68 64 64 72 64C80 64 88 68 88 76V100H56V76Z" fill="#d6e4ff" />
    <rect x="60" y="80" width="24" height="8" rx="4" fill="#bae0ff" />
    <circle cx="120" cy="50" r="22" stroke="#1677ff" strokeWidth="3" fill="none" opacity="0.3" />
    <circle cx="120" cy="50" r="16" stroke="#1677ff" strokeWidth="2" fill="#e6f4ff" opacity="0.5" />
    <line x1="136" y1="66" x2="148" y2="78" stroke="#1677ff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    <circle cx="110" cy="28" r="2" fill="#1677ff" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="140" cy="38" r="1.5" fill="#36cfc9" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="98" cy="42" r="1.5" fill="#722ed1" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
    </circle>
    <rect x="105" y="80" width="28" height="36" rx="4" fill="#ffffff" stroke="#d6e4ff" strokeWidth="1.5" transform="rotate(-8 105 80)" />
    <rect x="108" y="86" width="16" height="2" rx="1" fill="#bae0ff" transform="rotate(-8 108 86)" />
    <rect x="108" y="92" width="12" height="2" rx="1" fill="#d6e4ff" transform="rotate(-8 108 92)" />
    <rect x="108" y="98" width="18" height="2" rx="1" fill="#bae0ff" transform="rotate(-8 108 98)" />
  </svg>
);
const DocumentUploadSVG: React.FC = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="130" rx="60" ry="7" fill="#ecfdf5" opacity="0.6" />
    <rect x="55" y="25" width="60" height="80" rx="6" fill="#ffffff" stroke="#d6e4ff" strokeWidth="2" />
    <rect x="65" y="40" width="30" height="3" rx="1.5" fill="#bae0ff" />
    <rect x="65" y="48" width="40" height="3" rx="1.5" fill="#e6f4ff" />
    <rect x="65" y="56" width="35" height="3" rx="1.5" fill="#d6e4ff" />
    <rect x="65" y="64" width="25" height="3" rx="1.5" fill="#e6f4ff" />
    <rect x="65" y="72" width="38" height="3" rx="1.5" fill="#bae0ff" />
    <rect x="65" y="80" width="20" height="3" rx="1.5" fill="#d6e4ff" />
    <circle cx="100" cy="30" r="14" fill="#e6f4ff" stroke="#1677ff" strokeWidth="1.5" opacity="0.7" />
    <path d="M100 38V24M100 24L95 29M100 24L105 29" stroke="#1677ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </path>
    <path d="M130 60C130 52 137 47 144 49C146 42 154 40 160 44C166 42 172 47 170 54C175 56 176 62 172 66H132C128 64 128 60 130 60Z" fill="#e6f4ff" stroke="#bae0ff" strokeWidth="1" opacity="0.7" />
    <circle cx="45" cy="50" r="2" fill="#36cfc9" opacity="0.5">
      <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="142" cy="80" r="1.5" fill="#1677ff" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);
const NoJobsSVG: React.FC = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="130" rx="65" ry="7" fill="#e6f4ff" opacity="0.5" />
    <rect x="50" y="50" width="60" height="44" rx="8" fill="#e6f4ff" stroke="#bae0ff" strokeWidth="2" />
    <rect x="70" y="38" width="20" height="16" rx="4" fill="none" stroke="#bae0ff" strokeWidth="2" />
    <rect x="74" y="68" width="12" height="8" rx="3" fill="#1677ff" opacity="0.3" />
    <text x="130" y="48" fontSize="24" fill="#d6e4ff" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.7">?</text>
    <text x="140" y="70" fontSize="16" fill="#bae0ff" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.5">?</text>
    <text x="35" y="55" fontSize="18" fill="#d6e4ff" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.6">?</text>
    <circle cx="140" cy="90" r="12" fill="#f0f7ff" stroke="#bae0ff" strokeWidth="1.5" />
    <path d="M134 85H146M136 90H144M138 95H142" stroke="#1677ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <circle cx="50" cy="110" r="2" fill="#36cfc9" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="155" cy="50" r="1.5" fill="#722ed1" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);
const NoApplicationsSVG: React.FC = () => (
  <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="130" rx="65" ry="7" fill="#f0ecff" opacity="0.5" />
    <rect x="55" y="30" width="56" height="76" rx="6" fill="#ffffff" stroke="#d6e4ff" strokeWidth="2" />
    <rect x="72" y="24" width="22" height="12" rx="4" fill="#e6f4ff" stroke="#bae0ff" strokeWidth="1.5" />
    <rect x="64" y="48" width="10" height="10" rx="2" fill="none" stroke="#d6e4ff" strokeWidth="1.5" />
    <rect x="80" y="50" width="22" height="3" rx="1.5" fill="#e6f4ff" />
    <rect x="64" y="64" width="10" height="10" rx="2" fill="none" stroke="#d6e4ff" strokeWidth="1.5" />
    <rect x="80" y="66" width="18" height="3" rx="1.5" fill="#e6f4ff" />
    <rect x="64" y="80" width="10" height="10" rx="2" fill="none" stroke="#d6e4ff" strokeWidth="1.5" />
    <rect x="80" y="82" width="24" height="3" rx="1.5" fill="#e6f4ff" />
    <g transform="translate(120, 40) rotate(25)">
      <path d="M10 0C10 0 6 8 6 20C6 32 10 40 10 40C10 40 14 32 14 20C14 8 10 0 10 0Z" fill="#1677ff" opacity="0.3" />
      <circle cx="10" cy="18" r="3" fill="#e6f4ff" />
      <path d="M6 30L2 36L6 34Z" fill="#36cfc9" opacity="0.4" />
      <path d="M14 30L18 36L14 34Z" fill="#36cfc9" opacity="0.4" />
    </g>
    <circle cx="135" cy="85" r="2" fill="#faad14" opacity="0.5">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="40" cy="60" r="1.5" fill="#1677ff" opacity="0.4">
      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);
const ILLUSTRATIONS: Record<string, React.FC> = {
  'search-person': SearchPersonSVG,
  'document-upload': DocumentUploadSVG,
  'no-jobs': NoJobsSVG,
  'no-applications': NoApplicationsSVG,
};
export interface EmptyStateProps {
  illustration?: keyof typeof ILLUSTRATIONS;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}
const EmptyState: React.FC<EmptyStateProps> = ({
  illustration = 'search-person',
  title,
  description,
  actionText,
  onAction,
}) => {
  const Illustration = ILLUSTRATIONS[illustration] || SearchPersonSVG;
  return (
    <div
      className="stagger-item"
      style={{
        textAlign: 'center',
        padding: '48px 24px 56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <div style={{ marginBottom: 12, opacity: 0.9 }}>
        <Illustration />
      </div>
      <Text
        strong
        style={{
          display: 'block',
          fontSize: 17,
          color: '#1d1d1f',
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            display: 'block',
            fontSize: 13,
            color: '#94a3b8',
            maxWidth: 340,
            lineHeight: '1.6',
          }}
        >
          {description}
        </Text>
      )}
      {actionText && onAction && (
        <Button
          type="primary"
          onClick={onAction}
          className="glow-btn"
          style={{
            marginTop: 18,
            borderRadius: 8,
            fontWeight: 600,
            height: 40,
            paddingInline: 24,
            background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
            border: 'none',
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
