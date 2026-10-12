import { useQuery } from '@tanstack/react-query';
import { getData } from '@/services/mock/store';

export function useDemoData() {
  return useQuery({ queryKey: ['demo-data'], queryFn: getData });
}
