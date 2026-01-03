'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Filter,
    ArrowLeft,
    Download,
    Share2,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import UploadZone from '@/components/upload/UploadZone';
import TestResultCard from '@/components/results/TestResultCard';
import HealthScoreGauge from '@/components/results/HealthScoreGauge';
import ResultsCharts from '@/components/charts/ResultsCharts';
import { uploadAndAnalyzeReport, type AnalysisResponse, type TestResult } from '@/lib/api';

type FilterType = 'all' | 'normal' | 'abnormal';

export default function DashboardPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            const result = await uploadAndAnalyzeReport(file);
            setAnalysisResult(result);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err instanceof Error ? err.message : 'Failed to analyze report');

            // For demo purposes, show mock data if backend is not available
            setAnalysisResult(getMockData());
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
        setFilter('all');
    };

    const filteredTests = React.useMemo(() => {
        if (!analysisResult) return [];

        switch (filter) {
            case 'normal':
                return analysisResult.tests.filter((t) => t.status === 'NORMAL');
            case 'abnormal':
                return analysisResult.tests.filter((t) =>
                    ['LOW', 'HIGH'].includes(t.status || '')
                );
            default:
                return analysisResult.tests;
        }
    }, [analysisResult, filter]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-28 pb-12">
                <div className="container-custom">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-zinc-400" />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {analysisResult ? 'Analysis Results' : 'Upload Medical Report'}
                                </h1>
                                <p className="text-zinc-400 text-sm mt-1">
                                    {analysisResult
                                        ? 'Review your AI-powered medical report analysis'
                                        : 'Upload your PDF or image for instant AI analysis'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!analysisResult ? (
                            /* Upload Section */
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-w-2xl mx-auto mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                                    >
                                        <p className="text-red-400 text-center">{error}</p>
                                        <p className="text-zinc-500 text-sm text-center mt-2">
                                            Showing demo data for demonstration purposes.
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            /* Results Section */
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Actions Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-400" />
                                        <span className="text-zinc-300">
                                            Report ID: <span className="text-white font-mono">{analysisResult.report_id.slice(0, 8)}...</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <Download className="w-5 h-5 text-zinc-400" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <Share2 className="w-5 h-5 text-zinc-400" />
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-300"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            New Report
                                        </button>
                                    </div>
                                </div>

                                {/* Patient Info & Summary */}
                                {(analysisResult.patient_info || analysisResult.summary) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card p-6"
                                    >
                                        {analysisResult.patient_info && (
                                            <div className="flex flex-wrap gap-6 mb-4">
                                                {analysisResult.patient_info.name && (
                                                    <div>
                                                        <span className="text-zinc-500 text-sm">Patient</span>
                                                        <p className="text-white font-medium">{analysisResult.patient_info.name}</p>
                                                    </div>
                                                )}
                                                {analysisResult.patient_info.age && (
                                                    <div>
                                                        <span className="text-zinc-500 text-sm">Age</span>
                                                        <p className="text-white font-medium">{analysisResult.patient_info.age} years</p>
                                                    </div>
                                                )}
                                                {analysisResult.patient_info.gender && (
                                                    <div>
                                                        <span className="text-zinc-500 text-sm">Gender</span>
                                                        <p className="text-white font-medium">{analysisResult.patient_info.gender}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {analysisResult.summary && (
                                            <p className="text-zinc-300 leading-relaxed">{analysisResult.summary}</p>
                                        )}
                                    </motion.div>
                                )}

                                {/* Health Score Gauge */}
                                <HealthScoreGauge
                                    score={analysisResult.health_score || 0}
                                    tests={analysisResult.tests}
                                />

                                {/* Charts */}
                                <ResultsCharts tests={analysisResult.tests} />

                                {/* Test Results */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-white">
                                            Test Results ({filteredTests.length})
                                        </h2>

                                        {/* Filter Tabs */}
                                        <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5">
                                            <FilterButton
                                                active={filter === 'all'}
                                                onClick={() => setFilter('all')}
                                            >
                                                All
                                            </FilterButton>
                                            <FilterButton
                                                active={filter === 'normal'}
                                                onClick={() => setFilter('normal')}
                                            >
                                                Normal
                                            </FilterButton>
                                            <FilterButton
                                                active={filter === 'abnormal'}
                                                onClick={() => setFilter('abnormal')}
                                            >
                                                Abnormal
                                            </FilterButton>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filteredTests.map((test, index) => (
                                            <TestResultCard key={index} test={test} index={index} />
                                        ))}
                                    </div>

                                    {filteredTests.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-zinc-500">No tests found for this filter.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-indigo-500 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {children}
        </button>
    );
}

// Mock data for demonstration when backend is not available
function getMockData(): AnalysisResponse {
    return {
        report_id: 'demo-' + Math.random().toString(36).slice(2, 10),
        patient_info: {
            name: 'John Doe',
            age: 35,
            gender: 'Male',
        },
        tests: [
            {
                test_name: 'Hemoglobin',
                observed_value: '12.5',
                unit: 'g/dL',
                reference_range: { min: 13.5, max: 17.5 },
                status: 'LOW',
                severity: 'yellow',
                explanation: 'Hemoglobin carries oxygen in your blood. A slightly low level may indicate mild anemia. This could be due to iron deficiency, diet, or other factors. Consider increasing iron-rich foods and consult your doctor if you experience fatigue.',
                alert_message: 'Your hemoglobin is slightly below the normal range. Consider discussing with your healthcare provider.',
            },
            {
                test_name: 'Fasting Blood Sugar',
                observed_value: '95',
                unit: 'mg/dL',
                reference_range: { min: 70, max: 100 },
                status: 'NORMAL',
                severity: 'green',
                explanation: 'Your fasting blood sugar is within the healthy range, indicating good glucose control.',
            },
            {
                test_name: 'Total Cholesterol',
                observed_value: '220',
                unit: 'mg/dL',
                reference_range: { min: 0, max: 200 },
                status: 'HIGH',
                severity: 'yellow',
                explanation: 'Total cholesterol includes all types of cholesterol in your blood. A level above 200 mg/dL is considered borderline high. Lifestyle changes like diet and exercise can help lower cholesterol levels.',
            },
            {
                test_name: 'HDL Cholesterol',
                observed_value: '55',
                unit: 'mg/dL',
                reference_range: { min: 40, max: 60 },
                status: 'NORMAL',
                severity: 'green',
                explanation: 'HDL is "good" cholesterol that helps remove other forms of cholesterol from your blood. Your level is healthy.',
            },
            {
                test_name: 'LDL Cholesterol',
                observed_value: '145',
                unit: 'mg/dL',
                reference_range: { min: 0, max: 100 },
                status: 'HIGH',
                severity: 'red',
                explanation: 'LDL is "bad" cholesterol that can build up in arteries. Your level is elevated and may increase cardiovascular risk. Consider dietary changes and discuss treatment options with your doctor.',
                alert_message: 'Your LDL cholesterol is significantly elevated. Please consult with your healthcare provider for proper evaluation and treatment options.',
            },
            {
                test_name: 'Triglycerides',
                observed_value: '150',
                unit: 'mg/dL',
                reference_range: { min: 0, max: 150 },
                status: 'NORMAL',
                severity: 'green',
                explanation: 'Triglycerides are a type of fat in your blood. Your level is at the upper limit of normal.',
            },
            {
                test_name: 'Creatinine',
                observed_value: '1.0',
                unit: 'mg/dL',
                reference_range: { min: 0.7, max: 1.3 },
                status: 'NORMAL',
                severity: 'green',
                explanation: 'Creatinine is a waste product filtered by your kidneys. Normal levels indicate healthy kidney function.',
            },
            {
                test_name: 'TSH',
                observed_value: '2.5',
                unit: 'mIU/L',
                reference_range: { min: 0.4, max: 4.0 },
                status: 'NORMAL',
                severity: 'green',
                explanation: 'Thyroid Stimulating Hormone (TSH) regulates thyroid function. Your level indicates normal thyroid activity.',
            },
        ],
        health_score: 72,
        summary: 'Your overall health profile shows mostly normal results with a few areas that need attention. Your cholesterol levels, particularly LDL, are elevated and should be discussed with your healthcare provider. Hemoglobin is slightly low, which may warrant further investigation.',
        overall_status: 'borderline',
    };
}
