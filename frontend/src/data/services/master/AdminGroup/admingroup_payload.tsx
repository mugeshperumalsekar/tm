export interface AdmingroupPayload {
  name: string;
  moduleUrl: String;
}

export interface AdminPayload {
  groupId: number;
  categoryId: number;
  clientId: number;
}

export interface ClientPayload {
  groupId: number;
  categoryId: number;
  clientId: number;
  userId: number;
}