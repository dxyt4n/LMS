"use client";

import * as z from "zod";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: { url: string }[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const toggleEdit = () => setEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      await axios.patch(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
          {isEditing ? "Cancel" : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
          )}
        </>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="url"
            control={control}
            render={({ field }) => (
              <FileUpload
                onChange={(url) => {
                  if (url) {
                    setValue("url", url);
                    handleSubmit(onSubmit)();
                  }
                }}
              />
            )}
          />
          {isUploading && <p className="text-sm mt-2 text-blue-500">Uploading...</p>}
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </form>
      )}
    </div>
  );
};
