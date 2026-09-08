import { ObjectId, Filter } from "mongodb";
import clientPromise from "@/lib/db/mongodb";
import type {
  LearningDocument,
  LearningDocumentDTO,
  DocumentProcessingStatus,
  DocumentFileType,
} from "@/types/document";

const DATABASE_NAME = "searchlearn";
const DOCUMENTS_COLLECTION = "learning_documents";

async function getDocumentsCollection() {
  const client = await clientPromise;
  return client.db(DATABASE_NAME).collection<LearningDocument>(DOCUMENTS_COLLECTION);
}

export function serializeDocument(doc: LearningDocument): LearningDocumentDTO {
  return {
    ...doc,
    _id: doc._id ? doc._id.toString() : "",
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function createDocument(data: {
  title: string;
  description?: string;
  courseId?: string;
  uploadedBy: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  storagePath?: string;
}): Promise<LearningDocumentDTO> {
  const collection = await getDocumentsCollection();
  const now = new Date();

  const newDoc: LearningDocument = {
    ...data,
    processingStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(newDoc);
  return serializeDocument({
    ...newDoc,
    _id: result.insertedId,
  });
}

export async function getDocumentById(id: string): Promise<LearningDocumentDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getDocumentsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  return serializeDocument(doc);
}

export async function getDocuments(options?: {
  userId?: string;
  courseId?: string;
}): Promise<LearningDocumentDTO[]> {
  const collection = await getDocumentsCollection();
  const filter: Filter<LearningDocument> = {};

  if (options?.userId) {
    filter.uploadedBy = options.userId;
  }

  if (options?.courseId && options.courseId !== "all") {
    filter.courseId = options.courseId;
  }

  const docs = await collection.find(filter).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeDocument);
}

export async function updateDocumentStatus(
  id: string,
  status: DocumentProcessingStatus,
  updates?: {
    extractedText?: string;
    processingError?: string;
  }
): Promise<LearningDocumentDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getDocumentsCollection();
  const updateData: Partial<LearningDocument> = {
    processingStatus: status,
    updatedAt: new Date(),
  };

  if (updates?.extractedText !== undefined) {
    updateData.extractedText = updates.extractedText;
  }
  if (updates?.processingError !== undefined) {
    updateData.processingError = updates.processingError;
  }

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeDocument(result);
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getDocumentsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
