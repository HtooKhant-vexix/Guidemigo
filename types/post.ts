export interface PostCreateData {
  content: string;
  location?: string;
  images?: Array<{
    uri: string;
    type: string;
    name: string;
  }>;
}
