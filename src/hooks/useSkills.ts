import { useState, useEffect } from 'react';
import { skillApi } from '@/api/skillApi';
import type { Skill } from '@/types/skill';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await skillApi.getSkills();
        setSkills(res.data.data);
      } catch {
        // Fallback mock skills
        setSkills([
          { id: 1, name: 'React' }, { id: 2, name: 'TypeScript' },
          { id: 3, name: 'Java' }, { id: 4, name: 'Spring Boot' },
          { id: 5, name: 'Python' }, { id: 6, name: 'SQL' },
          { id: 7, name: 'Docker' }, { id: 8, name: 'Figma' },
          { id: 9, name: 'SEO' }, { id: 10, name: 'Excel' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { skills, loading };
}
