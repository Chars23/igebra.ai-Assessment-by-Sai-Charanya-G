"use client";
import React, { useEffect, useState } from "react";
import OverviewStats from "../components/OverviewStats";
import BarChart from "../components/BarChart";
import ScatterPlot from "../components/ScatterPlot";
import RadarChart from "../components/RadarChart";
import StudentTable from "../components/StudentTable";
import { Student } from "../types/Student"; // ✅ shared type

const parseRow = (keys: string[], values: string[]): Student => {
  return {
    student_id: values[keys.indexOf("student_id")],
    name: values[keys.indexOf("name")],
    email: values[keys.indexOf("email")],
    course: values[keys.indexOf("course")],
    class: values[keys.indexOf("class")],
    comprehension: Number(values[keys.indexOf("comprehension")]),
    attention: Number(values[keys.indexOf("attention")]),
    focus: Number(values[keys.indexOf("focus")]),
    retention: Number(values[keys.indexOf("retention")]),
    engagement_time: Number(values[keys.indexOf("engagement_time")]),
    assessment_score: Number(values[keys.indexOf("assessment_score")]),
    persona: values[keys.indexOf("persona")],
  };
};

const fetchData = async (): Promise<Student[]> => {
  const res = await fetch("/student_cognitive_skills_persona.csv");
  const text = await res.text();
  const [header, ...rows] = text.trim().split("\n");
  const keys = header.split(",");

  return rows.map((row) => {
    const values = row.split(",");
    return parseRow(keys, values);
  });
};

const getAverages = (data: Student[]) => ({
  comprehension: data.reduce((sum, s) => sum + s.comprehension, 0) / data.length,
  attention: data.reduce((sum, s) => sum + s.attention, 0) / data.length,
  focus: data.reduce((sum, s) => sum + s.focus, 0) / data.length,
  retention: data.reduce((sum, s) => sum + s.retention, 0) / data.length,
  engagement_time:
    data.reduce((sum, s) => sum + s.engagement_time, 0) / data.length,
  assessment_score:
    data.reduce((sum, s) => sum + s.assessment_score, 0) / data.length,
});

const getBarData = (data: Student[]) => {
  const skills = [
    "comprehension",
    "attention",
    "focus",
    "retention",
    "engagement_time",
  ] as const;
  return {
    labels: skills,
    data: skills.map(
      (skill) => data.reduce((sum, s) => sum + s[skill], 0) / data.length
    ),
  };
};

const getScatterData = (data: Student[]) =>
  data.map((s: Student) => ({ x: s.attention, y: s.assessment_score }));

const getRadarData = (student: Student) => {
  const labels = [
    "comprehension",
    "attention",
    "focus",
    "retention",
    "engagement_time",
  ] as const;
  const data = labels.map((label) => student[label]);
  return { labels, data };
};

const getInsights = (data: Student[]) => {
  const skills = [
    "comprehension",
    "attention",
    "focus",
    "retention",
    "engagement_time",
  ] as const;
  let maxCorr = -Infinity;
  let bestSkill = "";
  skills.forEach((skill) => {
    const xs = data.map((s) => s[skill]);
    const ys = data.map((s) => s.assessment_score);
    const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
    const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
    const num = xs
      .map((x, i) => (x - meanX) * (ys[i] - meanY))
      .reduce((a, b) => a + b, 0);
    const den = Math.sqrt(
      xs.map((x) => (x - meanX) ** 2).reduce((a, b) => a + b, 0) *
        ys.map((y) => (y - meanY) ** 2).reduce((a, b) => a + b, 0)
    );
    const corr = num / den;
    if (corr > maxCorr) {
      maxCorr = corr;
      bestSkill = skill;
    }
  });
  return `Strongest correlation with assessment score: ${bestSkill} (${maxCorr.toFixed(
    2
  )})`;
};

const DashboardPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    fetchData().then((data) => {
      setStudents(data);
      setSelected(data[0]);
      setInsight(getInsights(data));
    });
  }, []);

  if (!students.length) return <div className="p-8">Loading...</div>;
  const averages = getAverages(students);
  const bar = getBarData(students);
  const scatter = getScatterData(students);
  const radar = selected ? getRadarData(selected) : { labels: [], data: [] };

  return (
    <div className="p-8 max-w-7xl mx-auto font-display bg-white min-h-screen space-y-10">
      <h1 className="text-4xl font-extrabold mb-8 text-black drop-shadow-lg tracking-tight text-center">
        Cognitive Skills & Student Performance Dashboard
      </h1>

      {/* Overview Stats */}
      <section className="bg-white rounded-2xl shadow-card p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-black">Overview Stats (Avg Scores & Skills)</h2>
        <OverviewStats stats={averages} />
      </section>

      {/* Charts Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-200 flex flex-col">
          <h2 className="font-semibold mb-2 text-black text-lg">Bar Chart: Skill vs Score</h2>
          <BarChart labels={[...bar.labels]} data={bar.data} />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-200 flex flex-col">
          <h2 className="font-semibold mb-2 text-black text-lg">Scatter: Attention vs Performance</h2>
          <ScatterPlot data={scatter} />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-200 flex flex-col">
          <h2 className="font-semibold mb-2 text-black text-lg">Radar: Student Profile</h2>
          <select
            className="mb-4 p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black/30 outline-none text-black bg-white"
            aria-label="Select student for radar chart"
            value={selected?.student_id}
            onChange={(e) =>
              setSelected(
                students.find((s) => s.student_id === e.target.value) || null
              )
            }
          >
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} ({s.class})
              </option>
            ))}
          </select>
          <RadarChart labels={[...radar.labels]} data={radar.data} />
        </div>
      </section>

      {/* Student Table */}
      <section className="bg-white rounded-2xl shadow-card p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-black">Student Table (Searchable & Sortable)</h2>
        <StudentTable data={students} />
      </section>

      {/* Insights Section */}
      <section className="bg-black rounded-2xl shadow-card p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Insights: Key Findings</h2>
        <p className="text-white text-base font-medium">{insight}</p>
      </section>
    </div>
  );
};

export default DashboardPage;
