export interface ParsedResume {
  summary: string;
  projects: { title: string; description: string[] }[];
  skills: { name: string; level: string }[];
  education: string;
  languages: string[];
}
