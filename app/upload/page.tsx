import { DashboardLayout } from "@/components/dashboard-layout";
import { FileUpload } from "@/components/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileSpreadsheet, FileImage, FileText } from "lucide-react";

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Upload Center
          </h2>
          <p className="text-muted-foreground">
            Upload your financial documents for AI-powered analysis
          </p>
        </section>

        <FileUpload />

        <section aria-labelledby="file-types-heading">
          <h3 id="file-types-heading" className="text-lg font-semibold mb-4">
            Supported File Types
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-base">PDF Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Bank statements, receipts, and invoices in PDF format
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileSpreadsheet
                      className="h-5 w-5 text-accent"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-base">CSV Files</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Transaction exports from your bank or financial apps
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                    <FileImage
                      className="h-5 w-5 text-chart-3"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-base">Images</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Photos of receipts and paper documents (JPG, PNG)
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
