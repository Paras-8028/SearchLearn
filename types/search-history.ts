import type { ObjectId } from "mongodb";
import type { SearchContentType } from "./search";

export interface SearchHistoryItem {
  _id?: ObjectId;
  userId: string;
  query: string;
  filters?: {
    contentTypes?: SearchContentType[];
    courseId?: string;
  };
  createdAt: Date;
}

export interface SearchHistoryDTO {
  _id: string;
  userId: string;
  query: string;
  filters?: {
    contentTypes?: SearchContentType[];
    courseId?: string;
  };
  createdAt: string;
}
