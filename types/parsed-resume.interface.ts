export interface ParsedResume {
  summary: string;
  experience?: {
    company: string;
    role: string;
    period: string;
    description?: string;
  }[];
  projects?: {
    title: string;
    description: string[];
  }[];
  education?: {
    institution: string;
    degree?: string;
    years?: string;
  }[] | string;
  skills?: { name: string; level: string }[] | string;
  languages?: { name: string; level: string }[] | string[];
}
