"use client";

import type { file_table } from "~/server/db/schema";
import { UploadButton } from "./uploadthing";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { File, FileText } from "lucide-react";

export function FilesPage(props: {
  project: { name: string };
  files: (typeof file_table.$inferSelect)[];
  projectId: number;
}) {
  const { project, files } = props;

  const navigate = useRouter();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground">
            Manage files for {project.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <UploadButton
            endpoint="imageUploader"
            input={{
              projectId: props.projectId,
            }}
            onClientUploadComplete={() => {
              navigate.refresh();
            }}
          />
          {/**
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </UploadButton>
          **/}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input className="max-w-sm" placeholder="Search files..." />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Word</SelectItem>
            <SelectItem value="xlsx">Excel</SelectItem>
            <SelectItem value="pptx">PowerPoint</SelectItem>
            <SelectItem value="zip">Archive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
          <CardDescription>Manage all files for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  {file.mimeType === "pdf" ? (
                    <FileText className="h-10 w-10 text-red-500" />
                  ) : file.mimeType === "docx" ? (
                    <FileText className="h-10 w-10 text-blue-500" />
                  ) : file.mimeType === "xlsx" ? (
                    <FileText className="h-10 w-10 text-green-500" />
                  ) : file.mimeType === "pptx" ? (
                    <FileText className="h-10 w-10 text-orange-500" />
                  ) : (
                    <File className="h-10 w-10 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">
                        {file.mimeType.toUpperCase()}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        Size: {file.size}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Uploaded: {file.createdAt.toString()}
                      </span>
                      {/**
                      <span className="text-muted-foreground text-xs">
                        By: {file}
                      </span>
                      **/}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
