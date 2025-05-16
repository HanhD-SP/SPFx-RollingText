export interface IRollingTextProps {
  description: string;
  listContent: string;
  listName: string;
  Text: string;
  context: any;
  lists: any;
  listId: number;
  items: string[];
  item: string;
  Speed: number;
  Direction: string;
  Delay: number;
  Loop: boolean;
  // onPropertyChange: (propertyPath: string, newValue: any) => void;
}