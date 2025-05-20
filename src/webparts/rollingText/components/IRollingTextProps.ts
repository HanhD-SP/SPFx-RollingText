export interface IRollingTextProps {
  description: string;
  listContent: string;
  listTitle: string;
  Text: string;
  Speed: number;
  Direction: string;
  Delay: number;
  Loop: boolean;
  context: any; // Use a more specific type if available
  lists: any;
  listId: number;
  items: string[];
  item: string;
  // onPropertyChange: (propertyPath: string, newValue: any) => void;
}

