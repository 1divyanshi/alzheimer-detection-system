import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Cpu,
  FlaskConical,
  Network,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";

const stages = [
  {
    stage: 1,
    label: "Non Demented",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    description:
      "Normal cognitive function. No clinically significant memory loss detected in MRI analysis. Brain structures appear within normal range.",
    symptoms: [
      "Normal memory function",
      "No structural abnormalities",
      "Clear hippocampal volume",
    ],
  },
  {
    stage: 2,
    label: "Very Mild Demented",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
    description:
      "Subtle changes in brain structure. Slight memory lapses that don't significantly affect daily living. Often indistinguishable from normal aging.",
    symptoms: [
      "Occasional forgetfulness",
      "Slight hippocampal shrinkage",
      "Minimal cognitive impact",
    ],
  },
  {
    stage: 3,
    label: "Mild Demented",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
    description:
      "Noticeable cognitive decline. Moderate brain atrophy visible in MRI. Memory and thinking issues begin to affect daily activities and relationships.",
    symptoms: [
      "Memory and reasoning difficulty",
      "Visible cortical thinning",
      "Increased ventricle size",
    ],
  },
  {
    stage: 4,
    label: "Moderate Demented",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    description:
      "Significant brain atrophy clearly visible in MRI scans. Major cognitive impairment affecting most areas of daily life. Requires caregiver support.",
    symptoms: [
      "Severe memory loss",
      "Significant brain volume loss",
      "Major functional impairment",
    ],
  },
];

const modelSpecs = [
  { label: "Architecture", value: "Convolutional Neural Network (CNN)" },
  { label: "Input Size", value: "224 × 224 pixels" },
  { label: "Classes", value: "4 (Alzheimer's stages)" },
  { label: "Validation Accuracy", value: "94.7%" },
  { label: "Preprocessing", value: "Resize, Normalize, Augment" },
  { label: "Platform", value: "Internet Computer (ICP)" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            About the System
          </h1>
        </div>
        <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-3xl">
          AlzheimerAI is a deep learning-powered diagnostic assistant built on
          the Internet Computer blockchain, providing secure, transparent, and
          instant classification of brain MRI scans into four Alzheimer's
          disease stages.
        </p>
      </motion.div>

      {/* Disclaimer banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-start gap-4 p-5 rounded-xl bg-amber-50 border border-amber-200 mb-12"
      >
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-display font-semibold text-amber-800 mb-1">
            Research & Educational Use Only
          </p>
          <p className="text-sm text-amber-700 font-body">
            This system is intended for{" "}
            <strong>research and educational purposes only</strong>. Results
            should not be used for clinical diagnosis or to replace professional
            medical advice. Always consult a qualified neurologist or healthcare
            provider for medical decisions.
          </p>
        </div>
      </motion.div>

      {/* Model overview */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-12"
      >
        <motion.h2
          variants={item}
          className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
        >
          <Cpu className="w-6 h-6 text-primary" />
          CNN Model Architecture
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <Card className="shadow-card border-border/60 h-full">
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {modelSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between"
                    >
                      <dt className="text-sm text-muted-foreground font-body">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-medium font-body text-foreground">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="shadow-card border-border/60 h-full">
              <CardHeader>
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Image Upload",
                    desc: "MRI scan is uploaded securely to the Internet Computer blockchain.",
                  },
                  {
                    step: 2,
                    title: "Preprocessing",
                    desc: "Image is resized to 224×224, normalized, and prepared for inference.",
                  },
                  {
                    step: 3,
                    title: "CNN Inference",
                    desc: "Convolutional layers extract spatial features; fully-connected layers classify.",
                  },
                  {
                    step: 4,
                    title: "Result Delivery",
                    desc: "Predicted class, confidence score, and class probabilities are returned.",
                  },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-primary-foreground font-display font-bold">
                        {s.step}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground">
                        {s.title}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <Separator className="mb-12" />

      {/* 4 stages */}
      <section className="mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
        >
          <Brain className="w-6 h-6 text-primary" />
          The Four Classification Stages
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {stages.map((s) => (
            <motion.div key={s.stage} variants={item}>
              <Card className={`shadow-card border ${s.border} bg-white`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}
                    >
                      <span
                        className={`font-display font-bold text-lg ${s.color}`}
                      >
                        {s.stage}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`font-display font-bold text-lg ${s.color}`}
                        >
                          {s.label}
                        </h3>
                        <Badge
                          className={`text-xs border ${s.bg} ${s.color} ${s.border}`}
                        >
                          Stage {s.stage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed mb-3">
                        {s.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.symptoms.map((sym) => (
                          <span
                            key={sym}
                            className={`text-xs px-2.5 py-1 rounded-full font-body font-medium ${s.bg} ${s.color}`}
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Privacy */}
      <Card className="shadow-card border-border/60 bg-primary/5">
        <CardContent className="p-6 flex items-start gap-4">
          <Shield className="w-8 h-8 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-bold text-foreground mb-2">
              Privacy & Security
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              AlzheimerAI runs entirely on the Internet Computer — a
              decentralized blockchain where smart contracts (canisters) execute
              computations with cryptographic guarantees. Your MRI scans are
              processed on-chain with no central server. Data access is
              controlled by your Internet Identity, ensuring you own your
              medical data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
