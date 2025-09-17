"use client";
import React, { useEffect, useState } from 'react';
import OverviewStats from '../components/OverviewStats';
import BarChart from '../components/BarChart';
import ScatterPlot from '../components/ScatterPlot';
import RadarChart from '../components/RadarChart';
import StudentTable from '../components/StudentTable';

interface Student {
  student_id: string;
  name: string;
  class: string;
  comprehension: number;
  attention: number;
  focus: number;
  retention: number;
  engagement_time: number;
  assessment_score: number;
  persona: string;
}

const fetchData = async (): Promise<Student[]> => {
  const res = await fetch('/student_cognitive_skills_persona.csv');
  const text = await res.text();
  const [header, ...rows] = text.trim().split('\n');
  const keys = header.split(',');
  return rows.map(row => {
    const values = row.split(',');
    const obj: Record<string, string | number> = {};
    keys.forEach((key, i) => {
      obj[key] = isNaN(Number(values[i])) ? values[i] : Number(values[i]);
    });
  return obj as unknown as Student;
  });
};

const getAverages = (data: Student[]) => {
  const keys = ['comprehension','attention','focus','retention','engagement_time','assessment_score'] as const;
  const stats: Record<typeof keys[number], number> = {
    comprehension: 0,
    attention: 0,
    focus: 0,
    retention: 0,
    engagement_time: 0,
    assessment_score: 0,
  };
  keys.forEach(key => {
    stats[key] = data.reduce((sum, s) => sum + s[key], 0) / data.length;
  });
  return stats;
};

const getBarData = (data: Student[]) => {
  const skills = ['comprehension','attention','focus','retention','engagement_time'] as const;
  return {
    labels: skills.slice(),
    data: skills.map(skill => data.reduce((sum, s) => sum + s[skill], 0) / data.length),
  };
};

const getScatterData = (data: Student[]) =>
  data.map(s => ({ x: s.attention, y: s.assessment_score }));

const getRadarData = (student: Student) => {
  const labels = ['comprehension','attention','focus','retention','engagement_time'] as const;
  const data = labels.map(label => student[label]);
  return { labels: labels.slice(), data };
};

const getInsights = (data: Student[]) => {
  // Example: Find the skill with the highest correlation to assessment_score
  const skills = ['comprehension','attention','focus','retention','engagement_time'] as const;
  let maxCorr = -Infinity;
  let bestSkill = '';
  skills.forEach(skill => {
    const xs = data.map(s => s[skill]);
    const ys = data.map(s => s.assessment_score);
    const meanX = xs.reduce((a,b) => a+b,0)/xs.length;
    const meanY = ys.reduce((a,b) => a+b,0)/ys.length;
    const num = xs.map((x,i) => (x-meanX)*(ys[i]-meanY)).reduce((a,b)=>a+b,0);
    const den = Math.sqrt(xs.map(x=>(x-meanX)**2).reduce((a,b)=>a+b,0) * ys.map(y=>(y-meanY)**2).reduce((a,b)=>a+b,0));
    const corr = num/den;
    if (corr > maxCorr) { maxCorr = corr; bestSkill = skill; }
  });
  return `Strongest correlation with assessment score: ${bestSkill} (${maxCorr.toFixed(2)})`;
};

const DashboardPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    fetchData().then(data => {
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
    <div className="p-8 max-w-7xl mx-auto font-display bg-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-black drop-shadow-lg tracking-tight">Cognitive Skills & Student Performance Dashboard</h1>
      <OverviewStats stats={averages} />
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-200">
          <h2 className="font-semibold mb-2 text-black text-lg">Average Skill vs Assessment Score</h2>
          <BarChart labels={bar.labels} data={bar.data} />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-200">
          <h2 className="font-semibold mb-2 text-black text-lg">Attention vs Assessment Score</h2>
          <ScatterPlot data={scatter} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8 border border-gray-200">
        <h2 className="font-semibold mb-2 text-black text-lg">Student Cognitive Skill Profile</h2>
        <select className="mb-4 p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black/30 outline-none text-black bg-white" aria-label="Select student for radar chart" value={selected?.student_id} onChange={e => setSelected(students.find(s => s.student_id === e.target.value) || null)}>
          {students.map(s => (
            <option key={s.student_id} value={s.student_id}>{s.name} ({s.class})</option>
          ))}
        </select>
        <RadarChart labels={radar.labels} data={radar.data} />
      </div>
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8 border border-gray-200">
        <h2 className="font-semibold mb-2 text-black text-lg">Student Table</h2>
        <StudentTable data={students} />
      </div>
      <div className="bg-black rounded-2xl shadow-card p-6">
        <h2 className="font-semibold mb-2 text-white text-lg">Insights</h2>
        <p className="text-white text-base font-medium">{insight}</p>
      </div>
    </div>
  );
};

export default DashboardPage;
