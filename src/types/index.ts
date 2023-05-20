export enum Status {
  PENDING = 'pending',
  DONE = 'done',
}

export enum Services {
  UPLOAD_SERVICE = 'UPLOAD_SERVICE',
  SIGNER_SERVICE = 'SIGNER_SERVICE',
}

export type AllowedFiles = 'image' | 'video' | 'audio' | 'blob';
