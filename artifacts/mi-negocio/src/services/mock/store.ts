import { createSeed } from '@/data/seed';
import type { DemoData } from '@/types';

const KEY = 'mi-negocio-demo-v1';
const EVENT = 'mi-negocio-data-change';
let memory: DemoData | null = null;
const pause = () => new Promise(resolve => setTimeout(resolve, 180));
export async function getData(): Promise<DemoData> {
  await pause();
  if (!memory) {
    try { const raw = localStorage.getItem(KEY); memory = raw ? JSON.parse(raw) as DemoData : createSeed(); }
    catch { memory = createSeed(); }
    localStorage.setItem(KEY, JSON.stringify(memory));
  }
  return structuredClone(memory);
}
export async function saveData(data: DemoData): Promise<DemoData> {
  await pause(); memory = structuredClone(data); localStorage.setItem(KEY, JSON.stringify(memory));
  window.dispatchEvent(new CustomEvent(EVENT)); return structuredClone(memory);
}
export async function resetDemo(): Promise<DemoData> {
  const data = createSeed(); memory = data; localStorage.setItem(KEY, JSON.stringify(data));
  localStorage.removeItem('mi-negocio-session'); window.dispatchEvent(new CustomEvent(EVENT)); return structuredClone(data);
}
export { EVENT };
