import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { ScanRecord } from "../backend";
import { useSubmitScan } from "../hooks/useQueries";

const classColors: Record<string, string> = {
  NonDemented: "#16a34a",
  VeryMildDemented: "#ca8a04",
  MildDemented: "#ea580c",
  ModerateDemented: "#dc2626",
};

const classLabels: Record<string, string> = {
  NonDemented: "Non Demented",
  VeryMildDemented: "Very Mild",
  MildDemented: "Mild Demented",
  ModerateDemented: "Moderate",
};

const classBadgeVariants: Record<string, string> = {
  NonDemented: "bg-emerald-100 text-emerald-800 border-emerald-200",
  VeryMildDemented: "bg-yellow-100 text-yellow-800 border-yellow-200",
  MildDemented: "bg-orange-100 text-orange-800 border-orange-200",
  ModerateDemented: "bg-red-100 text-red-800 border-red-200",
};

function formatClass(cls: string): string {
  return classLabels[cls] ?? cls;
}

function buildChartData(scan: ScanRecord) {
  return [
    {
      name: "Non Demented",
      value: Number(scan.probNonDemented),
      key: "NonDemented",
    },
    {
      name: "Very Mild",
      value: Number(scan.probVeryMild),
      key: "VeryMildDemented",
    },
    { name: "Mild", value: Number(scan.probMild), key: "MildDemented" },
    {
      name: "Moderate",
      value: Number(scan.probModerate),
      key: "ModerateDemented",
    },
  ];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<ScanRecord | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitScan = useSubmitScan();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (JPG, PNG, DICOM preview).",
      );
      return;
    }
    setFile(f);
    setResult(null);
    setShowHeatmap(false);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    setShowHeatmap(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file) return;
    try {
      const blobId = `scan-${Date.now()}-${crypto.randomUUID()}`;
      const scan = await submitScan.mutateAsync(blobId);
      setResult(scan);
      setShowHeatmap(true);
      toast.success("MRI analysis complete!");
    } catch (err) {
      toast.error(
        `Analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const confidence = result ? Number(result.confidence) : 0;
  const chartData = result ? buildChartData(result) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            MRI Analysis
          </h1>
        </div>
        <p className="text-muted-foreground font-body">
          Upload a brain MRI scan image to receive instant Alzheimer's stage
          classification.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload + Preview column */}
        <div className="space-y-6">
          {/* Dropzone */}
          {!file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <label
                data-ocid="upload.dropzone"
                htmlFor="mri-file-input"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none block",
                  isDragging
                    ? "border-accent bg-accent/5 shadow-glow scale-[1.01]"
                    : "border-border hover:border-accent/60 hover:bg-secondary/50",
                )}
              >
                <input
                  id="mri-file-input"
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                      isDragging ? "bg-accent/20" : "bg-secondary",
                    )}
                  >
                    <Upload
                      className={cn(
                        "w-7 h-7 transition-colors",
                        isDragging ? "text-accent" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-lg">
                      {isDragging
                        ? "Drop your MRI here"
                        : "Drag & drop MRI scan"}
                    </p>
                    <p className="text-muted-foreground font-body text-sm mt-1">
                      or{" "}
                      <span className="text-accent font-medium">
                        browse files
                      </span>{" "}
                      — JPG, PNG, DICOM
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">
                    Max 20MB. Axial T1/T2 MRI preferred.
                  </p>
                </div>
              </label>
            </motion.div>
          )}

          {/* Preview */}
          <AnimatePresence>
            {file && preview && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-card border-border/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-display flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        {file.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleClear}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-h-72">
                      <img
                        src={preview}
                        alt="MRI preview"
                        className="w-full h-full object-contain"
                      />
                      {/* Grad-CAM simulated heatmap overlay */}
                      {showHeatmap && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse at 55% 45%, rgba(234,88,12,0.55) 0%, rgba(220,38,38,0.35) 30%, rgba(250,204,21,0.2) 55%, transparent 75%)",
                            mixBlendMode: "hard-light",
                          }}
                        />
                      )}
                      {/* Scan line animation during loading */}
                      {submitScan.isPending && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            className="absolute inset-x-0 h-0.5 bg-accent/80 animate-scan-line"
                            style={{
                              boxShadow:
                                "0 0 8px 2px oklch(0.64 0.20 200 / 0.6)",
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-2" />
                              <p className="text-white/90 text-sm font-body font-medium">
                                Analyzing MRI...
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Grad-CAM label */}
                    {showHeatmap && (
                      <p className="text-xs text-muted-foreground font-body mt-2 text-center">
                        🔥 Grad-CAM: highlighted regions contributed to the
                        prediction
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Submit button */}
                {!result && (
                  <Button
                    data-ocid="upload.primary_button"
                    onClick={handleSubmit}
                    disabled={submitScan.isPending}
                    size="lg"
                    className="w-full mt-4 h-12 font-body font-semibold bg-primary hover:bg-primary/90"
                  >
                    {submitScan.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Analyzing MRI...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 w-4 h-4" />
                        Analyze MRI Scan
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {submitScan.isPending && (
            <div
              data-ocid="upload.loading_state"
              className="flex items-center gap-3 text-muted-foreground font-body text-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Running neural network inference...
            </div>
          )}

          {/* Error state */}
          {submitScan.isError && (
            <motion.div
              data-ocid="upload.error_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitScan.error instanceof Error
                ? submitScan.error.message
                : "Analysis failed. Please try again."}
            </motion.div>
          )}
        </div>

        {/* Results column */}
        <div className="space-y-6">
          <AnimatePresence>
            {result ? (
              <motion.div
                data-ocid="upload.success_state"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Result card */}
                <Card className="shadow-card border-border/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <CardTitle className="font-display text-lg">
                        Analysis Result
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Predicted class */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div>
                        <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">
                          Predicted Stage
                        </p>
                        <p className="font-display font-bold text-xl text-foreground">
                          {formatClass(result.predictedClass)}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-sm font-medium border px-3 py-1",
                          classBadgeVariants[result.predictedClass] ??
                            "bg-gray-100 text-gray-800",
                        )}
                      >
                        {formatClass(result.predictedClass)}
                      </Badge>
                    </div>

                    {/* Confidence score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-body text-muted-foreground">
                          Confidence Score
                        </span>
                        <span className="font-display font-bold text-foreground">
                          {confidence}%
                        </span>
                      </div>
                      <Progress
                        value={confidence}
                        className="h-3"
                        style={
                          {
                            "--progress-color":
                              classColors[result.predictedClass] ??
                              "oklch(0.64 0.20 200)",
                          } as React.CSSProperties
                        }
                      />
                      <p className="text-xs text-muted-foreground font-body mt-1.5">
                        {confidence >= 90
                          ? "High confidence prediction"
                          : confidence >= 70
                            ? "Moderate confidence prediction"
                            : "Low confidence — consider repeat scan"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Probability chart */}
                <Card className="shadow-card border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-base">
                      Class Probabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 8, left: -24, bottom: 4 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.88 0.015 245)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fontSize: 11,
                            fontFamily: "Plus Jakarta Sans",
                          }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{
                            fontSize: 11,
                            fontFamily: "Plus Jakarta Sans",
                          }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          formatter={(v: number) => [`${v}%`, "Probability"]}
                          contentStyle={{
                            fontFamily: "Plus Jakarta Sans",
                            fontSize: 12,
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry) => (
                            <Cell
                              key={entry.key}
                              fill={classColors[entry.key] ?? "#6b7280"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* New scan button */}
                <Button
                  variant="outline"
                  className="w-full font-body"
                  onClick={handleClear}
                >
                  <Upload className="mr-2 w-4 h-4" />
                  Analyze Another Scan
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-80 rounded-2xl border-2 border-dashed border-border text-center p-8"
              >
                <Brain className="w-14 h-14 text-muted-foreground/40 mb-4" />
                <p className="font-display font-semibold text-foreground mb-1">
                  Results will appear here
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Upload and analyze an MRI scan to see the prediction,
                  confidence score, and probability breakdown.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
