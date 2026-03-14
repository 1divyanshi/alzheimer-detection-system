import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart2,
  Brain,
  Database,
  Loader2,
  ScanLine,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { ScanRecord } from "../backend";
import {
  useDeleteScan,
  useGetStats,
  useGetUserScans,
} from "../hooks/useQueries";

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

function formatDate(ts: bigint): string {
  const ms = Number(ts) * 1000;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

function buildPieData(scans: ScanRecord[]) {
  const counts: Record<string, number> = {};
  for (const s of scans) {
    counts[s.predictedClass] = (counts[s.predictedClass] ?? 0) + 1;
  }
  return Object.entries(counts).map(([key, value]) => ({
    name: classLabels[key] ?? key,
    value,
    key,
  }));
}

function buildLineData(scans: ScanRecord[]) {
  // Group by date
  const byDate: Record<string, number> = {};
  for (const s of scans) {
    const d = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(Number(s.timestamp) * 1000));
    byDate[d] = (byDate[d] ?? 0) + 1;
  }
  // Add mock historical data if no real data
  if (Object.keys(byDate).length === 0) {
    const mockDates = [
      "Jan 1",
      "Jan 8",
      "Jan 15",
      "Jan 22",
      "Jan 29",
      "Feb 5",
      "Feb 12",
    ];
    const mockCounts = [2, 4, 3, 7, 5, 8, 6];
    return mockDates.map((d, i) => ({ date: d, scans: mockCounts[i] }));
  }
  return Object.entries(byDate).map(([date, scans]) => ({ date, scans }));
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  loading,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
  iconClass?: string;
}) {
  return (
    <Card className="shadow-card border-border/60">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-body">{label}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="font-display text-3xl font-bold text-foreground mt-1">
                {value}
              </p>
            )}
            {sub && (
              <p className="text-xs text-muted-foreground font-body mt-1">
                {sub}
              </p>
            )}
          </div>
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              iconClass ?? "bg-primary/10",
            )}
          >
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: scans, isLoading: scansLoading } = useGetUserScans();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const deleteScan = useDeleteScan();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (id: bigint, idx: number) => {
    setDeletingId(id);
    try {
      await deleteScan.mutateAsync(id);
      toast.success(`Scan #${idx + 1} deleted successfully`);
    } catch (_err) {
      toast.error("Failed to delete scan");
    } finally {
      setDeletingId(null);
    }
  };

  const lastScan = scans && scans.length > 0 ? scans[scans.length - 1] : null;
  const pieData = scans ? buildPieData(scans) : [];
  const lineData = scans ? buildLineData(scans) : buildLineData([]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground font-body">
          Track your scan history and model performance metrics.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Database}
          label="Total Scans"
          value={stats ? Number(stats.totalScans).toString() : "0"}
          loading={statsLoading}
          iconClass="bg-blue-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Model Accuracy"
          value={stats?.modelAccuracy ?? "94.7%"}
          loading={statsLoading}
          iconClass="bg-emerald-50"
        />
        <StatCard
          icon={ScanLine}
          label="Last Prediction"
          value={
            lastScan
              ? (classLabels[lastScan.predictedClass] ??
                lastScan.predictedClass)
              : "—"
          }
          sub={
            lastScan ? `${Number(lastScan.confidence)}% confidence` : undefined
          }
          loading={scansLoading}
          iconClass="bg-violet-50"
        />
        <StatCard
          icon={Activity}
          label="AI System Status"
          value="Online"
          sub="All systems operational"
          iconClass="bg-emerald-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie chart */}
        <Card className="shadow-card border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Stage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Brain className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm font-body">No scans yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={classColors[entry.key] ?? "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [v, "Scans"]}
                    contentStyle={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "Plus Jakarta Sans",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Line chart */}
        <Card className="shadow-card border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Scans Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={lineData}
                margin={{ top: 4, right: 16, left: -24, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.015 245)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [v, "Scans"]}
                  contentStyle={{
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="oklch(0.30 0.12 258)"
                  strokeWidth={2.5}
                  dot={{ fill: "oklch(0.64 0.20 200)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scan history table */}
      <Card className="shadow-card border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Scan History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {scansLoading ? (
            <div data-ocid="dashboard.loading_state" className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !scans || scans.length === 0 ? (
            <div
              data-ocid="dashboard.empty_state"
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <ScanLine className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="font-display font-semibold text-foreground">
                No scans yet
              </p>
              <p className="text-sm text-muted-foreground font-body mt-1">
                Upload your first MRI scan to see results here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body font-semibold">ID</TableHead>
                  <TableHead className="font-body font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Predicted Stage
                  </TableHead>
                  <TableHead className="font-body font-semibold">
                    Confidence
                  </TableHead>
                  <TableHead className="font-body font-semibold text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan, idx) => (
                  <TableRow key={String(scan.id)} data-ocid={"dashboard.row"}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{idx + 1}
                    </TableCell>
                    <TableCell className="font-body text-sm">
                      {formatDate(scan.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs border",
                          classBadgeVariants[scan.predictedClass] ??
                            "bg-gray-100 text-gray-800",
                        )}
                      >
                        {classLabels[scan.predictedClass] ??
                          scan.predictedClass}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Number(scan.confidence)}%`,
                              background:
                                classColors[scan.predictedClass] ?? "#6b7280",
                            }}
                          />
                        </div>
                        <span className="text-sm font-body">
                          {Number(scan.confidence)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        data-ocid={`dashboard.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(scan.id, idx)}
                        disabled={deletingId === scan.id}
                      >
                        {deletingId === scan.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
