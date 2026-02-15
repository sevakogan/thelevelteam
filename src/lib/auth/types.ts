export type UserRole = "admin" | "collaborator" | "viewer";
export type UserStatus = "pending" | "approved" | "denied";

export interface Profile {
  readonly id: string;
  readonly email: string;
  readonly full_name: string | null;
  readonly avatar_url: string | null;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly created_at: string;
  readonly updated_at: string;
}

export function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "collaborator";
}
