import { supabase } from "@/lib/supabase";
import { AttachmentRow, AttachmentInsert, AttachmentUpdate } from "@/types/types";

export const addAttachment = async(attachment: AttachmentInsert): Promise<AttachmentRow> => {
    const { data, error } = await supabase
        .from("attachments")
        .insert(attachment)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const getAttachment = async(timelineEntryId: string): Promise<AttachmentRow[]> => {
    const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("timeline_entry_id", timelineEntryId)
    if (error) throw error;
    return data;
};

export const deleteAttachment = async(id: string): Promise<void> => {
    const { data, error } = await supabase
        .from("attachments")
        .delete()
        .eq("id",id)
    if (error) throw error;
};

export const uploadAttachment = async (timelineEntryId: string,file: any): Promise<AttachmentRow> => {

    const response = await fetch(file.uri);
    const blob = await response.blob();

    const fileName = `${timelineEntryId}-${Date.now()}`;

    const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(fileName, blob);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
        .from("attachments")
        .insert({
            timeline_entry_id: timelineEntryId,
            file_path: fileName,
            file_size: 0,
            file_type: file.mimeType ?? "unknown",
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};
