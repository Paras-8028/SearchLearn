import type { ObjectId } from "mongodb";

export type DocumentFileType = "pdf" | "txt" | "md";

export type DocumentProcessingStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface LearningDocument {
  _id?: ObjectId;
  title: string;
  description?: string;
  courseId?: string;
  uploadedBy: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  storagePath?: string;
  extractedText?: string;
  processingStatus: DocumentProcessingStatus;
  processingError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningDocumentDTO {
  _id: string;
  title: string;
  description?: string;
  courseId?: string;
  uploadedBy: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  storagePath?: string;
  extractedText?: string;
  processingStatus: DocumentProcessingStatus;
  processingError?: string;
  createdAt: string;
  updatedAt: string;
}
