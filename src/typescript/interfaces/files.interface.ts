interface MediaDataProps {
  created_at: string;
  filename: string;
  filetype: string;
  size: number;
  updated_at: string;
  url: string;
  _id: string;
}

export interface FilesDataProps {
  _id: string;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
  media: MediaDataProps[];
}
