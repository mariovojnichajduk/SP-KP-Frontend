export interface Image {
  id: string;
  url: string;
  thumbUrl?: string;
  mediumUrl?: string;
  originalFilename?: string;
  size?: number;
  width?: number;
  height?: number;
  displayOrder: number;
  listingId: string;
  createdAt: string;
}
