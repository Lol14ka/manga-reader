export interface ImageData {
  id: string;
  url: string;
}

export interface PanelProps {
  data: ImageData;
  centered?: boolean;
  onGetDimensions?: (dimensions: { width: number; height: number }) => void;
  horizontal?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
}
