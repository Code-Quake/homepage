export interface IWorkItem {
  id: number;
  title: string;
  description: string;
  content: string;
  state: string;
  remainingWork: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  workItemType: string;
}
