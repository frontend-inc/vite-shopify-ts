import { twMerge } from 'tailwind-merge';

type ClassValue = string | undefined | null | false | Record<string, boolean>;
type ClassArray = ClassValue[];

export function cn(...classes: (ClassValue | ClassArray)[]): string {
  const merged = classes
    .flat()
    .filter((cls): cls is string => typeof cls === 'string')
    .join(' ');
  return twMerge(merged);
}

export const truncate = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
