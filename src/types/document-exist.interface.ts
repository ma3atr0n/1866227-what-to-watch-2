export interface IDocumentExists {
  exist(documentId: string): Promise<boolean>;
}
