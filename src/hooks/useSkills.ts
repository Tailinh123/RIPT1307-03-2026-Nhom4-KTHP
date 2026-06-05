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
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setSkills(res.data.data);
        } else {
          setSkills([]);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  return { skills, loading };
}
