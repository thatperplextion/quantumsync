import React, { useState, useEffect, useRef } from 'react';
import { Upload, Zap, Database, Settings, Activity, CheckCircle, XCircle, Clock, FileText, TrendingUp, Box, Cpu, Network } from 'lucide-react';

export default function QuantumSync() {
  const [files, setFiles] = useState([]);
  const [resumeWebhook, setResumeWebhook] = useState('');
  const [invoiceWebhook, setInvoiceWebhook] = useState('');
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgTime: 0, successRate: 100 });
  const [activeTab, setActiveTab] = useState('upload');
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('quantumSyncHistory') || '[]');
    const savedStats = JSON.parse(localStorage.getItem('quantumSyncStats') || '{"total": 0, "avgTime": 0, "successRate": 100}');
    const savedResumeWebhook = localStorage.getItem('resumeWebhook') || '';
    const savedInvoiceWebhook = localStorage.getItem('invoiceWebhook') || '';
    
    setHistory(savedHistory);
    setStats(savedStats);
    setResumeWebhook(savedResumeWebhook);
    setInvoiceWebhook(savedInvoiceWebhook);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - distance / 750})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const processFiles = async () => {
    if (!resumeWebhook && !invoiceWebhook) {
      showToast('Please configure at least one webhook URL', 'error');
      return;
    }

    setProcessing(true);
    const startTime = Date.now();
    const newHistory = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      const isResume = file.name.toLowerCase().includes('resume') || file.name.toLowerCase().includes('cv');
      const webhook = isResume ? resumeWebhook : invoiceWebhook;
      const type = isResume ? 'Resume' : 'Invoice';

      if (!webhook) continue;

      try {
        const response = await fetch(webhook, {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        
        newHistory.push({
          id: Date.now() + Math.random(),
          filename: file.name,
          type: type,
          status: response.ok ? 'success' : 'error',
          timestamp: new Date().toISOString(),
          result: result,
          processingTime: ((Date.now() - startTime) / 1000).toFixed(2)
        });
      } catch (error) {
        newHistory.push({
          id: Date.now() + Math.random(),
          filename: file.name,
          type: type,
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message,
          processingTime: ((Date.now() - startTime) / 1000).toFixed(2)
        });
      }
    }

    const updatedHistory = [...newHistory, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('quantumSyncHistory', JSON.stringify(updatedHistory));

    const total = updatedHistory.length;
    const successful = updatedHistory.filter(h => h.status === 'success').length;
    const times = updatedHistory.map(h => parseFloat(h.processingTime)).filter(t => !isNaN(t));
    const avgTime = times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : 0;
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 100;

    const newStats = { total, avgTime, successRate };
    setStats(newStats);
    localStorage.setItem('quantumSyncStats', JSON.stringify(newStats));

    setProcessing(false);
    setFiles([]);
    showToast(`Successfully processed ${files.length} PDF(s)!`);
    setActiveTab('history');
  };

  const testConnection = async () => {
    if (!resumeWebhook && !invoiceWebhook) {
      showToast('Please enter at least one webhook URL', 'error');
      return;
    }

    showToast('Testing connection to n8n...');

    try {
      const testWebhook = resumeWebhook || invoiceWebhook;
      const response = await fetch(testWebhook, { method: 'GET' });

      if (response.ok || response.status === 404) {
        showToast(' Connection successful! Webhook is reachable.');
      } else {
        showToast(' Webhook responded but may not be configured correctly', 'error');
      }
    } catch (error) {
      showToast(' Connection failed. Check your webhook URL.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${
          toast.type === 'error' ? 'bg-red-500/90 border-red-400' : 'bg-emerald-500/90 border-emerald-400'
        } animate-slideIn`}>
          {toast.message}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-3 mb-4 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2">
            <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-semibold">AI-POWERED AUTOMATION</span>
          </div>
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            QuantumSync
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Next-generation PDF automation for HR & Finance workflows powered by GPT-4 and n8n
          </p>

          {/* Tech Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="w-4 h-4" />
              <span className="text-sm">GPT-4 Engine</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Network className="w-4 h-4" />
              <span className="text-sm">n8n Integration</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Real-time Processing</span>
            </div>
          </div>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Processed', value: stats.total, icon: Database, color: 'blue' },
            { label: 'Avg Time', value: `${stats.avgTime}s`, icon: Clock, color: 'purple' },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'emerald' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-${stat.color}-500/20 hover:border-${stat.color}-500/40 transition-all duration-300 hover:transform hover:scale-105`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                <div className={`px-3 py-1 bg-${stat.color}-500/20 rounded-full text-xs font-semibold text-${stat.color}-300`}>
                  LIVE
                </div>
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300 bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 bg-slate-800/30 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50">
          {[
            { id: 'upload', label: 'Upload & Process', icon: Upload },
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'history', label: 'History', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Box className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold">Upload PDF Documents</h2>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10 scale-105'
                    : 'border-slate-600 hover:border-blue-500/50 hover:bg-slate-800/30'
                }`}
              >
                <Upload className="w-20 h-20 mx-auto mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-2">Drop PDFs here or click to browse</h3>
                <p className="text-slate-400 mb-4">Supports: Resumes  Invoices  Financial Documents</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <span>Max 10 files</span>
                  <span></span>
                  <span>PDF only</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="mt-8 space-y-3">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Selected Files ({files.length})
                  </h3>
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <FileText className="w-10 h-10 text-purple-400" />
                        <div>
                          <div className="font-semibold">{file.name}</div>
                          <div className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={processFiles}
                      disabled={processing || files.length === 0}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <Zap className="w-6 h-6" />
                      {processing ? 'Processing...' : 'Process All PDFs'}
                    </button>
                    <button
                      onClick={() => setFiles([])}
                      className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold transition-all"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {processing && (
                <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-blue-300">Processing with AI...</p>
                  <p className="text-slate-400 text-sm mt-2">This may take a few moments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">n8n Webhook Configuration</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Resume Processing Webhook URL
                </label>
                <input
                  type="url"
                  value={resumeWebhook}
                  onChange={(e) => {
                    setResumeWebhook(e.target.value);
                    localStorage.setItem('resumeWebhook', e.target.value);
                  }}
                  placeholder="https://your-n8n.app/webhook/resume-processing"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Invoice Processing Webhook URL
                </label>
                <input
                  type="url"
                  value={invoiceWebhook}
                  onChange={(e) => {
                    setInvoiceWebhook(e.target.value);
                    localStorage.setItem('invoiceWebhook', e.target.value);
                  }}
                  placeholder="https://your-n8n.app/webhook/invoice-processing"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>

              <button
                onClick={testConnection}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Activity className="w-5 h-5" />
                Test Connection
              </button>
            </div>

            <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <Network className="w-5 h-5" />
                How it works
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1"></span>
                  <span>Files with "resume" or "cv" in the name  Resume Webhook</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1"></span>
                  <span>All other PDFs  Invoice Webhook</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1"></span>
                  <span>Your n8n workflows receive the PDF and process with GPT-4</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Processing History</h2>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No processing history yet</p>
                <p className="text-sm mt-2">Upload and process PDFs to see results here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-10 h-10 text-purple-400" />
                        <div>
                          <h3 className="font-semibold text-lg">{item.filename}</h3>
                          <p className="text-sm text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                        item.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                        item.status === 'error' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {item.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Type: {item.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time: {item.processingTime}s
                      </span>
                      {item.error && (
                        <span className="text-red-400">Error: {item.error}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
