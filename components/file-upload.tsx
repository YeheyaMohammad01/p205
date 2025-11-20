"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseCSV } from "@/lib/csv-parser";
import { useFinancial } from "@/contexts/financial-context";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
}

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { addTransactions } = useFinancial();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading" as const,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      for (const fileObj of Array.from(fileList)) {
        try {
          // Simulate progress
          const interval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) => {
                if (f.name === fileObj.name && f.status === "uploading") {
                  const newProgress = Math.min(f.progress + 20, 90);
                  return { ...f, progress: newProgress };
                }
                return f;
              })
            );
          }, 100);

          if (fileObj.name.endsWith(".csv")) {
            const transactions = await parseCSV(fileObj);
            addTransactions(transactions);
            toast.success(
              `Imported ${transactions.length} transactions from ${fileObj.name}`
            );
          }

          clearInterval(interval);

          setFiles((prev) =>
            prev.map((f) =>
              f.name === fileObj.name
                ? { ...f, progress: 100, status: "success" as const }
                : f
            )
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.name === fileObj.name ? { ...f, status: "error" as const } : f
            )
          );
          toast.error(`Failed to process ${fileObj.name}`);
        }
      }
    },
    [addTransactions]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback((fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Drop your files here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, CSV, and image files (JPG, PNG)
          </p>
          <label htmlFor="file-input">
            <Button
              type="button"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              Browse Files
            </Button>
          </label>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.csv,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileInput}
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          {files.map((file) => (
            <Card key={file.name}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      {file.status === "success" ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0"
                          onClick={() => removeFile(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="h-1.5" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
