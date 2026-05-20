import React from 'react';
import { Tag } from 'antd';
import type { Skill } from '@/types/skill';

const TAG_COLORS = [
  '#e6f4ff', '#f0f5ff', '#f6ffed', '#fff7e6', '#fff1f0', '#f9f0ff',
];
const TEXT_COLORS = [
  '#1677ff', '#2f54eb', '#52c41a', '#fa8c16', '#ff4d4f', '#722ed1',
];

interface JobSkillTagProps {
  skill: Skill;
  index?: number;
}

const JobSkillTag: React.FC<JobSkillTagProps> = ({ skill, index = 0 }) => {
  const colorIdx = index % TAG_COLORS.length;
  return (
    <Tag
      style={{
        background: TAG_COLORS[colorIdx],
        color: TEXT_COLORS[colorIdx],
        border: 'none',
        borderRadius: 6,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 500,
        lineHeight: '22px',
      }}
    >
      {skill.name}
    </Tag>
  );
};

export default JobSkillTag;
