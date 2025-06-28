import React, { useState } from 'react';

const DUMMY_RESUME = {
  name: 'John Doe',
  summary: 'Experienced developer with a passion for building impactful software.',
  experience: [
    { company: 'Tech Corp', role: 'Software Engineer', years: '2020-2023', description: 'Developed scalable web applications.' },
  ],
  education: [
    { school: 'State University', degree: 'B.Sc. Computer Science', years: '2016-2020' },
  ],
  skills: ['JavaScript', 'React', 'Python'],
};

const API_URL = 'http://127.0.0.1:8000';

function Section({ title, content, onChange, onEnhance, editable = true }) {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai-enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: title.toLowerCase(), content }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      if (!data.improved_content) {
        throw new Error('Invalid response from server');
      }
      onEnhance(data.improved_content);
    } catch (err) {
      alert('Failed to enhance with AI: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 mb-4 shadow-lg transition-transform duration-300 ${hovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-accent">{title}</h2>
        {editable && (
          <button
            className="ml-2 px-3 py-1 bg-accent text-primary rounded hover:bg-sky-400 transition-colors duration-300 disabled:opacity-50"
            onClick={handleEnhance}
            disabled={loading}
          >
            {loading ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        )}
      </div>
      {editable ? (
        <textarea
          className="w-full bg-gray-900 text-white rounded p-2 resize-y focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
          rows={3}
          value={content}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
}

export default function ResumeEditor() {
  const [resume, setResume] = useState(DUMMY_RESUME);
  const [saving, setSaving] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Handlers for each section
  const handleField = (field, value) => setResume(r => ({ ...r, [field]: value }));

  const handleExperienceChange = (idx, key, value) => {
    setResume(r => {
      const exp = [...r.experience];
      exp[idx][key] = value;
      return { ...r, experience: exp };
    });
  };

  const handleAddExperience = () => {
    setResume(r => ({
      ...r,
      experience: [...r.experience, { company: '', role: '', years: '', description: '' }],
    }));
  };

  const handleRemoveExperience = idx => {
    setResume(r => ({
      ...r,
      experience: r.experience.filter((_, i) => i !== idx),
    }));
  };

  const handleEducationChange = (idx, key, value) => {
    setResume(r => {
      const edu = [...r.education];
      edu[idx][key] = value;
      return { ...r, education: edu };
    });
  };

  const handleAddEducation = () => {
    setResume(r => ({
      ...r,
      education: [...r.education, { school: '', degree: '', years: '' }],
    }));
  };

  const handleRemoveEducation = idx => {
    setResume(r => ({
      ...r,
      education: r.education.filter((_, i) => i !== idx),
    }));
  };

  const handleSkillChange = (idx, value) => {
    setResume(r => {
      const skills = [...r.skills];
      skills[idx] = value;
      return { ...r, skills };
    });
  };

  const handleAddSkill = () => {
    setResume(r => ({ ...r, skills: [...r.skills, ''] }));
  };

  const handleRemoveSkill = idx => {
    setResume(r => ({ ...r, skills: r.skills.filter((_, i) => i !== idx) }));
  };

  // AI Enhance handlers
  const enhanceSection = (section, value) => {
    setResume(r => ({ ...r, [section]: value }));
  };

  // Save Resume
  const saveResume = async () => {
    setSaving(true);
    try {
      // Clean resume object: remove undefined values
      const cleanResume = JSON.parse(JSON.stringify(resume));
      console.log('Saving resume:', cleanResume);
      const res = await fetch(`${API_URL}/save-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanResume), // send resume fields at top level
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(JSON.stringify(error.detail) || `Server error: ${res.status}`);
      }
      alert('Resume saved!');
    } catch (err) {
      alert('Failed to save resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Download Resume
  const downloadResume = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Upload Resume (mock parse)
  const handleUpload = e => {
    const file = e.target.files[0];
    if (file) {
      // Mock: just use dummy data
      setResume(DUMMY_RESUME);
      alert('Resume parsed (mock)!');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900/80 to-primary/90 backdrop-blur-xl rounded-xl p-6 shadow-2xl animate-fade-in border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="file"
          accept=".pdf,.docx"
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-primary hover:file:bg-sky-400 transition-colors duration-300 focus:ring-2 focus:ring-accent/60"
          onChange={handleUpload}
        />
        <div className="flex gap-2">
          <button
            onClick={saveResume}
            className="px-4 py-2 bg-accent text-primary rounded-lg shadow hover:bg-sky-400 focus:ring-2 focus:ring-accent/60 transition-all duration-300 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Resume'}
          </button>
          <button
            onClick={downloadResume}
            className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-accent rounded-lg shadow hover:from-gray-600 hover:to-gray-700 focus:ring-2 focus:ring-accent/60 transition-all duration-300"
          >
            Download JSON
          </button>
          {downloadUrl && (
            <a href={downloadUrl} download="resume.json" className="hidden" id="download-link">Download</a>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            className="flex-1 bg-gray-800/80 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-accent/60 transition-all duration-300 shadow-inner border border-gray-700"
            value={resume.name}
            onChange={e => handleField('name', e.target.value)}
            placeholder="Full Name"
          />
        </div>
        <Section
          title="Summary"
          content={resume.summary}
          onChange={v => handleField('summary', v)}
          onEnhance={v => enhanceSection('summary', v)}
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-accent">Experience</h2>
            <button
              className="px-2 py-1 bg-accent text-primary rounded-lg shadow hover:bg-sky-400 focus:ring-2 focus:ring-accent/60 transition-all duration-300"
              onClick={handleAddExperience}
            >Add</button>
          </div>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="bg-gray-800/80 rounded-lg p-4 mb-2 transition-shadow duration-300 hover:shadow-2xl border border-gray-700">
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={exp.company}
                  onChange={e => handleExperienceChange(idx, 'company', e.target.value)}
                  placeholder="Company"
                />
                <input
                  className="flex-1 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={exp.role}
                  onChange={e => handleExperienceChange(idx, 'role', e.target.value)}
                  placeholder="Role"
                />
                <input
                  className="w-28 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={exp.years}
                  onChange={e => handleExperienceChange(idx, 'years', e.target.value)}
                  placeholder="Years"
                />
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-400 focus:ring-2 focus:ring-red-300 transition-all duration-300"
                  onClick={() => handleRemoveExperience(idx)}
                >Remove</button>
              </div>
              <textarea
                className="w-full bg-gray-900/80 text-white rounded-lg p-2 resize-y focus:outline-none focus:ring-2 focus:ring-accent/60 transition-all duration-300 shadow-inner border border-gray-700"
                rows={2}
                value={exp.description}
                onChange={e => handleExperienceChange(idx, 'description', e.target.value)}
                placeholder="Description"
              />
              <button
                className="mt-2 px-3 py-1 bg-accent text-primary rounded-lg shadow hover:bg-sky-400 focus:ring-2 focus:ring-accent/60 transition-all duration-300"
                onClick={async () => {
                  const res = await fetch(`${API_URL}/ai-enhance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ section: 'experience', content: exp.description }),
                  });
                  const data = await res.json();
                  handleExperienceChange(idx, 'description', data.improved_content);
                }}
              >Enhance with AI</button>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-accent">Education</h2>
            <button
              className="px-2 py-1 bg-accent text-primary rounded-lg shadow hover:bg-sky-400 focus:ring-2 focus:ring-accent/60 transition-all duration-300"
              onClick={handleAddEducation}
            >Add</button>
          </div>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="bg-gray-800/80 rounded-lg p-4 mb-2 transition-shadow duration-300 hover:shadow-2xl border border-gray-700">
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={edu.school}
                  onChange={e => handleEducationChange(idx, 'school', e.target.value)}
                  placeholder="School"
                />
                <input
                  className="flex-1 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={edu.degree}
                  onChange={e => handleEducationChange(idx, 'degree', e.target.value)}
                  placeholder="Degree"
                />
                <input
                  className="w-28 bg-gray-900/80 text-white rounded-lg p-2 shadow-inner border border-gray-700"
                  value={edu.years}
                  onChange={e => handleEducationChange(idx, 'years', e.target.value)}
                  placeholder="Years"
                />
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-400 focus:ring-2 focus:ring-red-300 transition-all duration-300"
                  onClick={() => handleRemoveEducation(idx)}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-accent">Skills</h2>
            <button
              className="px-2 py-1 bg-accent text-primary rounded-lg shadow hover:bg-sky-400 focus:ring-2 focus:ring-accent/60 transition-all duration-300"
              onClick={handleAddSkill}
            >Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center bg-gray-800/80 rounded-lg px-2 py-1 border border-gray-700">
                <input
                  className="bg-gray-900/80 text-white rounded-lg p-1 mr-2 shadow-inner border border-gray-700"
                  value={skill}
                  onChange={e => handleSkillChange(idx, e.target.value)}
                  placeholder="Skill"
                />
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-400 focus:ring-2 focus:ring-red-300 transition-all duration-300"
                  onClick={() => handleRemoveSkill(idx)}
                >Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
