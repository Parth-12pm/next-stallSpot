// components/AssignmentViewer.tsx
"use client";

import React from "react";
import {
  Eye,
  Download,
  Search,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentItem {
  _id: string;
  name: string;
  type: "assignment" | "experiment";
  url: string;
  createdAt: string;
}

const DocumentCard = ({
  doc,
  type,
  onDelete,
  onDownload,
}: {
  doc: DocumentItem;
  type: string;
  onDelete: (id: string, type: string) => void;
  onDownload: (url: string, name: string) => void;
}) => (
  <Card className="flex items-center p-4 transition-shadow hover:shadow-md">
    <CardContent className="flex items-center gap-4 p-0 w-full">
      {/* Preview */}
      <div className="w-24 h-36 bg-muted rounded flex-shrink-0 overflow-hidden border">
        <iframe
          src={`${doc.url}#view=FitH&toolbar=0&scrollbar=0`}
          className="w-full h-full pointer-events-none"
          title={`Preview of ${doc.name}`}
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-card-foreground truncate">
          {doc.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </div>
    </CardContent>

    {/* Actions */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open(doc.url, "_blank")}
        title="View PDF"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDownload(doc.url, doc.name)}
        title="Download"
      >
        <Download className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(doc._id, type)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </Card>
);

const UploadSection = ({
  type,
  documentName,
  setDocumentName,
  error,
  uploading,
  onUpload,
}: {
  type: "assignment" | "experiment";
  documentName: string;
  setDocumentName: (value: string) => void;
  error: string;
  uploading: boolean;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "assignment" | "experiment"
  ) => void;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Upload New {type === "assignment" ? "Assignment" : "Experiment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            id={`name-${type}`}
            placeholder="Enter document name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <Input
            id={`upload-${type}`}
            type="file"
            accept=".pdf"
            onChange={(e) => onUpload(e, type)}
            disabled={uploading}
            ref={fileInputRef}
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AssignmentViewer() {
  const [assignments, setAssignments] = React.useState<DocumentItem[]>([]);
  const [experiments, setExperiments] = React.useState<DocumentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("assignments");
  const [assignmentError, setAssignmentError] = React.useState("");
  const [experimentError, setExperimentError] = React.useState("");
  const [assignmentName, setAssignmentName] = React.useState("");
  const [experimentName, setExperimentName] = React.useState("");

  React.useEffect(() => {
    void fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, experimentsRes] = await Promise.all([
        fetch("/api/document?type=assignment"),
        fetch("/api/document?type=experiment"),
      ]);

      const assignmentsData = await assignmentsRes.json();
      const experimentsData = await experimentsRes.json();

      if (assignmentsData.success) setAssignments(assignmentsData.data);
      if (experimentsData.success) setExperiments(experimentsData.data);
    } catch (err) {
      // Set error for both as it's a general fetch failure
      setAssignmentError("Failed to load documents");
      setExperimentError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = React.useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "assignment" | "experiment"
    ) => {
      const file = e.target.files?.[0];
      const name = type === "assignment" ? assignmentName : experimentName;
      const setErrorState =
        type === "assignment" ? setAssignmentError : setExperimentError;

      if (!file) return;

      if (file.type !== "application/pdf") {
        setErrorState("Please upload only PDF files");
        return;
      }

      if (!name.trim()) {
        setErrorState("Please enter a document name");
        return;
      }

      setUploading(true); // Keep a single uploading state for simplicity
      setErrorState("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name.trim());
      formData.append("type", type);

      try {
        const res = await fetch("/api/document", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          if (type === "assignment") {
            setAssignments([data.data, ...assignments]);
          } else {
            setExperiments([data.data, ...experiments]);
          }
          if (type === "assignment") setAssignmentName("");
          else setExperimentName("");
          e.target.value = "";
        } else {
          setErrorState(data.error || "Upload failed");
        }
      } catch (err) {
        setErrorState("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [assignmentName, assignments, experimentName, experiments]
  );

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await fetch(`/api/document?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        if (type === "assignment") {
          setAssignments(assignments.filter((a) => a._id !== id));
        } else {
          setExperiments(experiments.filter((e) => e._id !== id));
        }
      } else {
        const errorSetter =
          type === "assignment" ? setAssignmentError : setExperimentError;
        errorSetter(data.error || "Delete failed");
      }
    } catch (err) {
      const errorSetter =
        type === "assignment" ? setAssignmentError : setExperimentError;
      errorSetter("Delete failed. Please try again.");
    }
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    link.click();
  };

  const filterDocuments = (docs: DocumentItem[]) => {
    return docs.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assignments & Experiments</h1>
          <p className="text-muted-foreground">
            Upload and manage your PDF documents
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="assignments">
              Assignments ({assignments.length})
            </TabsTrigger>
            <TabsTrigger value="experiments">
              Experiments ({experiments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <UploadSection
              type="assignment"
              documentName={assignmentName}
              setDocumentName={setAssignmentName}
              error={assignmentError}
              uploading={uploading}
              onUpload={handleUpload}
            />

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : filterDocuments(assignments).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No matching assignments found"
                      : "No assignments uploaded yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filterDocuments(assignments).map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    type="assignment"
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiments">
            <UploadSection
              type="experiment"
              documentName={experimentName}
              setDocumentName={setExperimentName}
              error={experimentError}
              uploading={uploading}
              onUpload={handleUpload}
            />

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            ) : filterDocuments(experiments).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No matching experiments found"
                      : "No experiments uploaded yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filterDocuments(experiments).map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    doc={doc}
                    type="experiment"
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
