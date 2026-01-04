'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FileSearch,
  AlertTriangle,
  Heart,
  Upload,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  BarChart3,
  CheckCircle,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Brain,
  Target,
  PieChart,
  Zap,
  ShieldCheck,
  FileText,
  Activity,
  Award,
  LineChart,
  History,
  Bell
} from 'lucide-react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
          />
          
          {/* Floating grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                               linear-gradient(to bottom, #fff 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">AI-Powered Medical Intelligence</span>
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="block text-white">Understand Your</span>
                    <span className="relative">
                      <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Medical Reports
                      </span>
                      <motion.div
                        animate={{ 
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-30"
                        style={{ backgroundSize: "200% 200%" }}
                      />
                    </span>
                  </h1>

                  <p className="text-xl text-zinc-300 max-w-xl leading-relaxed">
                    Upload your medical reports and get instant AI-powered analysis. 
                    We translate complex medical terminology into clear, actionable insights.
                  </p>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/dashboard"
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 w-fit"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    />
                    <Upload className="w-5 h-5" />
                    Start Free Analysis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-4 pt-8"
                >
                  <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                    <div className="text-xs text-zinc-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">24/7</div>
                    <div className="text-xs text-zinc-400">Analysis</div>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-2xl font-bold text-white mb-1">10K+</div>
                    <div className="text-xs text-zinc-400">Reports</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Visual - 3D Health Dashboard */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-[500px]"
              >
                {/* Main Dashboard Card */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateX: [0, 3, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-sm transform-style-3d"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Health Score */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-zinc-400 mb-2">Overall Health Score</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">84</div>
                    <div className="text-xs text-zinc-500 mt-1">out of 100</div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Normal", value: 72, color: "from-emerald-500 to-emerald-600" },
                      { label: "Warning", value: 18, color: "from-amber-500 to-amber-600" },
                      { label: "Critical", value: 10, color: "from-rose-500 to-rose-600" }
                    ].map((item, index) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-300">{item.label}</span>
                          <span className="text-zinc-400">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-sm text-zinc-400">Reports</div>
                      <div className="text-lg font-bold text-white">12</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <div className="text-sm text-zinc-400">Family</div>
                      <div className="text-lg font-bold text-white">4</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements - Properly Aligned */}
                {[
                  { 
                    icon: FileText, 
                    color: "from-blue-500 to-cyan-500",
                    position: "top-0 right-0",
                    delay: 0
                  },
                  { 
                    icon: Calendar, 
                    color: "from-purple-500 to-pink-500",
                    position: "top-1/4 -right-4",
                    delay: 0.3
                  },
                  { 
                    icon: Users, 
                    color: "from-emerald-500 to-teal-500",
                    position: "bottom-1/4 -left-4",
                    delay: 0.6
                  },
                  { 
                    icon: LineChart, 
                    color: "from-amber-500 to-orange-500",
                    position: "bottom-0 left-0",
                    delay: 0.9
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: item.delay }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`absolute ${item.position}`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border border-white/20`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Health Clarity
              </span>
            </h2>
            <p className="text-lg text-zinc-400">
              Our intelligent platform combines cutting-edge AI with medical expertise 
              to deliver unparalleled insights into your health reports.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Report Upload & Analysis",
                description: "Upload PDF or image medical reports for instant AI analysis",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Calendar,
                title: "Report Date Selection",
                description: "Specify the date of the medical report (defaults to today)",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: FileSearch,
                title: "Medical Term Simplification",
                description: "Complex terminology explained in simple language",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: AlertTriangle,
                title: "Abnormal Value Detection",
                description: "Automatic flagging with color-coded indicators (🟢🟡🔴)",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: Bell,
                title: "Health Insights & Alerts",
                description: "Clear guidance for values needing attention",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: BarChart3,
                title: "Visual Analytics",
                description: "Interactive charts for understanding health data",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: Activity,
                title: "Health Score",
                description: "Overall health score (0-100) based on test results",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Users,
                title: "Family Profiles",
                description: "Manage health profiles for family members",
                color: "from-violet-500 to-purple-500"
              },
              {
                icon: History,
                title: "Historical Tracking",
                description: "Track and compare test results over time",
                color: "from-cyan-500 to-blue-500"
              },
              {
                icon: MessageSquare,
                title: "AI Follow-up Chat",
                description: "Ask questions about your results",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: ShieldCheck,
                title: "HIPAA Compliant",
                description: "Bank-level security for your medical data",
                color: "from-teal-500 to-green-500"
              },
              {
                icon: Award,
                title: "10K+ Reports Analyzed",
                description: "Trusted by thousands for accurate medical insights",
                color: "from-orange-500 to-amber-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative group h-full">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl p-6 border border-white/10 backdrop-blur-sm h-full group-hover:border-white/20 transition-all duration-500">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works in
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-lg text-zinc-400">
              Get your medical report analyzed instantly with our intelligent platform
            </p>
          </motion.div>

          <div className="relative">
            {/* 3D Timeline Connector */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 transform -translate-y-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Report",
                  description: "Upload your PDF or image medical report. Our AI instantly processes the document.",
                  icon: Upload,
                  color: "from-blue-500 to-cyan-500",
                  features: ["PDF/Image Support", "Instant Processing", "Secure Upload"]
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our advanced AI analyzes the report, detects abnormalities, and prepares insights.",
                  icon: Brain,
                  color: "from-purple-500 to-pink-500",
                  features: ["Term Simplification", "Value Detection", "Health Scoring"]
                },
                {
                  step: "03",
                  title: "Get Insights",
                  description: "Receive clear, actionable insights with visual analytics and recommendations.",
                  icon: TrendingUp,
                  color: "from-emerald-500 to-teal-500",
                  features: ["Visual Charts", "Health Alerts", "AI Chat Support"]
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-lg font-bold text-white shadow-lg border-4 border-zinc-900`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Main Card */}
                  <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 rounded-2xl p-8 border border-white/10 backdrop-blur-sm pt-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white text-center mb-4">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-center mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {step.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                          <span className="text-sm text-zinc-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-purple-500/20" />
              </div>

              <div className="relative p-12 text-center">
                {/* Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Understand Your
                  <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Medical Reports?
                  </span>
                </h2>

                <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
                  Upload your first report and experience the power of AI-powered medical analysis.
                  No registration required.
                </p>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    href="/dashboard"
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    />
                    <Upload className="w-6 h-6" />
                    Start Free Analysis Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-10 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-zinc-400">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm text-zinc-400">Results in Seconds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-zinc-400">No Medical Jargon</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}