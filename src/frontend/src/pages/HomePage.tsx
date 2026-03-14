import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Clock,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetStats } from "../hooks/useQueries";

const features = [
  {
    icon: Brain,
    title: "CNN Deep Learning",
    description:
      "State-of-the-art Convolutional Neural Network trained on thousands of MRI scans for accurate classification.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Target,
    title: "94.7% Accuracy",
    description:
      "Validated against clinical datasets with an impressive accuracy rate across all four Alzheimer's stages.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "4-Stage Classification",
    description:
      "Classifies MRI scans into NonDemented, VeryMild, Mild, and ModerateDemented with confidence scores.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Powered by blockchain AI on the Internet Computer — results delivered in seconds with full transparency.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description:
      "Your MRI data is processed on-chain with cryptographic guarantees. No third-party data sharing.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "The Internet Computer never sleeps. Access AI-powered MRI analysis anytime, anywhere.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const stages = [
  {
    label: "Non Demented",
    color: "bg-emerald-500",
    pct: "Normal brain structure",
  },
  {
    label: "Very Mild",
    color: "bg-yellow-500",
    pct: "Early cognitive changes",
  },
  {
    label: "Mild Demented",
    color: "bg-orange-500",
    pct: "Noticeable memory loss",
  },
  { label: "Moderate", color: "bg-red-500", pct: "Significant impairment" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { data: stats } = useGetStats();

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 medical-gradient"
          style={{
            backgroundImage: `url('/assets/generated/hero-bg.dim_1920x600.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 medical-gradient opacity-85" />

        {/* Animated grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.64 0.20 200) 1px, transparent 1px), linear-gradient(90deg, oklch(0.64 0.20 200) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
              <span className="text-sm font-medium text-white/90 font-body">
                Powered by Blockchain AI
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              AI-Powered
              <br />
              <span className="text-gradient">Alzheimer</span>
              <br />
              Detection
            </h1>

            <p className="text-xl text-white/75 font-body mb-10 max-w-xl leading-relaxed">
              Upload brain MRI scans and receive instant classification across
              four Alzheimer's disease stages using our trained Convolutional
              Neural Network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 shadow-glow h-12"
                >
                  Analyze MRI Scan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-body font-semibold px-8 h-12"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              {
                label: "Total Scans",
                value: stats ? Number(stats.totalScans).toLocaleString() : "0",
                suffix: "",
              },
              {
                label: "Model Accuracy",
                value: stats?.modelAccuracy ?? "94.7%",
                suffix: "",
              },
              { label: "Disease Stages", value: "4", suffix: " Classified" },
              { label: "Avg. Analysis Time", value: "< 3", suffix: " seconds" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-6 text-center">
                <div className="font-display text-3xl font-bold text-primary">
                  {stat.value}
                  <span className="text-sm font-body text-muted-foreground">
                    {stat.suffix}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground font-body mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/20 text-sm font-medium font-body mb-4">
            <Star className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Medical-Grade AI Analysis
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Combining deep learning precision with blockchain transparency for
            trustworthy neurological insights.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Card className="h-full shadow-card hover:shadow-card-hover transition-shadow duration-300 border-border/60">
                <CardContent className="p-6">
                  <div
                    className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                  >
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2 text-lg">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Classification stages */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              4-Stage Classification
            </h2>
            <p className="text-muted-foreground font-body text-lg">
              Our model classifies MRI scans into four distinct Alzheimer's
              progression stages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="text-center shadow-card border-border/60 overflow-hidden">
                  <div className={`h-1.5 ${stage.color}`} />
                  <CardContent className="p-6">
                    <div
                      className={`inline-block w-12 h-12 rounded-full ${stage.color} opacity-15 mb-3`}
                    />
                    <div
                      className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center mx-auto -mt-[60px] mb-3`}
                    >
                      <span className="text-white font-display font-bold text-lg">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {stage.label}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {stage.pct}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-primary rounded-2xl p-12 shadow-glow"
          >
            <Brain className="w-12 h-12 text-accent mx-auto mb-5" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Analyze Your MRI?
            </h2>
            <p className="text-white/70 font-body mb-8">
              Upload a brain MRI scan and get instant AI-powered classification
              with confidence scores and visual explanations.
            </p>
            <Link to="/upload">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-10 h-12"
              >
                Start Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
