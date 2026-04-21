import { Database } from "./database.types";

// Vehicles
export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

// Required Services
export type RequiredServiceRow = Database["public"]["Tables"]["required_services"]["Row"];
export type RequiredServiceInsert = Database["public"]["Tables"]["required_services"]["Insert"];
export type RequiredServiceUpdate = Database["public"]["Tables"]["required_services"]["Update"];

// timelineEntry Entries
export type timelineEntryRow = Database["public"]["Tables"]["timeline_entries"]["Row"];
export type timelineEntryInsert = Database["public"]["Tables"]["timeline_entries"]["Insert"];
export type timelineEntryUpdate = Database["public"]["Tables"]["timeline_entries"]["Update"];

// Attachments
export type AttachmentRow = Database["public"]["Tables"]["attachments"]["Row"];
export type AttachmentInsert = Database["public"]["Tables"]["attachments"]["Insert"];
export type AttachmentUpdate = Database["public"]["Tables"]["attachments"]["Update"];

// Notifications
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];

// Profiles
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
