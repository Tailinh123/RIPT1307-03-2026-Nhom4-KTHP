import { useState, useEffect } from 'react';
import { skillApi } from '@/api/skillApi';
import type { Skill } from '@/types/skill';

const MOCK_SKILLS: Skill[] = [
  { id: 1, name: 'React' }, { id: 2, name: 'TypeScript' },
  { id: 3, name: 'Java' }, { id: 4, name: 'Spring Boot' },
  { id: 5, name: 'Python' }, { id: 6, name: 'SQL' },
  { id: 7, name: 'Docker' }, { id: 8, name: 'Figma' },
  { id: 9, name: 'SEO' }, { id: 10, name: 'Excel' },
];

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await skillApi.getSkills();
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setSkills(res.data.data);
        } else {
          setSkills(MOCK_SKILLS);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
        setSkills(MOCK_SKILLS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { skills, loading };
}
