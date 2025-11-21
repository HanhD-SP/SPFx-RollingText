import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRollingTextProps {
  description: string;
  listTitle: string;
  Text: string;
  Speed: number;
  Direction: string;
  Delay: number;
  Loop: boolean;
  listId: any;
  items: string[];
  listContent: string;
  selectedList: string;
  context: WebPartContext;
  lists: string | string []; // Stores the list ID(s)
  speedSeconds: number; // The speed of the rolling text animation in seconds
  pauseOnHover: boolean; // Whether to pause the animation on hover
  textColor?: string; // Text color for the rolling text
}
export interface IList {
  Title: string;
  Id: string;
  listId: any;
}

