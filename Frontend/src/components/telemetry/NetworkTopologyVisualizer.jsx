import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

/**
 * Enterprise Network Node Topology Model
 * Designed with extensible structure to allow seamless connection
 * to live telemetry backends (Zabbix, SNMP, Syslog, Kafka, WebSocket) in future.
 */
const DEFAULT_NODES = [
  {
    id: 'RTR-CORE',
    label: 'RTR-CORE-01',
    type: 'Core Backbone Router',
    x: 0.18, // normalized position (0..1)
    y: 0.22,
    baseStatus: 'healthy',
    eps: '142.6K',
    latency: '0.18ms',
    interfaces: '12x 100GbE',
    tag: 'BGP/OSPF'
  },
  {
    id: 'DC-EDGE',
    label: 'DC-EDGE-A',
    type: 'Data Center Aggregation',
    x: 0.82,
    y: 0.22,
    baseStatus: 'healthy',
    eps: '98.2K',
    latency: '0.34ms',
    interfaces: '8x 40GbE',
    tag: 'VXLAN'
  },
  {
    id: 'FDR-GW-03',
    label: 'FDR-GW-03',
    type: 'Feeder Gateway Substation',
    x: 0.12,
    y: 0.58,
    baseStatus: 'healthy',
    eps: '44.8K',
    latency: '1.12ms',
    interfaces: '4x 10GbE',
    tag: 'SCADA/IP'
  },
  {
    id: 'FIREWALL',
    label: 'NGFW-CLUSTER',
    type: 'Sovereign Perimeter FW',
    x: 0.88,
    y: 0.58,
    baseStatus: 'healthy',
    eps: '112.4K',
    latency: '0.22ms',
    interfaces: '16x 25GbE',
    tag: 'STATEFUL'
  },
  {
    id: 'SRV-AGENTS',
    label: 'SRV-AGENTS',
    type: 'Telemetry Collector Mesh',
    x: 0.28,
    y: 0.84,
    baseStatus: 'healthy',
    eps: '68.5K',
    latency: '0.45ms',
    interfaces: 'Distributed',
    tag: 'eBPF/GRPC'
  },
  {
    id: 'SW-BANER',
    label: 'SW-BANER-02',
    type: 'Core Distribution Switch',
    x: 0.72,
    y: 0.84,
    baseStatus: 'healthy',
    eps: '58.3K',
    latency: '0.28ms',
    interfaces: '48x 10GbE',
    tag: 'L2/L3'
  },
  {
    id: 'SIEM-INGEST',
    label: 'SIEM-PIPE',
    type: 'MITRE ATT&CK Correlator',
    x: 0.50,
    y: 0.12,
    baseStatus: 'healthy',
    eps: '500K+',
    latency: '0.08ms',
    interfaces: 'Kernel Stream',
    tag: 'SOAR'
  }
];

export const NetworkTopologyVisualizer = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Hovered node state for interactive tooltip
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [activeAlert, setActiveAlert] = useState(null);
  const [liveEventMessage, setLiveEventMessage] = useState('● Live Stream: 524.8k EPS | 0 Drops');

  // Preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Cycling live micro event status labels
  useEffect(() => {
    const eventMessages = [
      '● Live Stream: 524.8k EPS | 0 Drops',
      '● BGP/OSPF Peer Mesh: 100% Converged',
      '● MITRE ATT&CK Engine: Zero Drift',
      '● Sub-second NetFlow v9 Ingestion',
      '● NCCM Sentinel: 100% Config State',
      '● Air-Gap Cryptographic Envelope: Active'
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % eventMessages.length;
      if (!activeAlert) {
        setLiveEventMessage(eventMessages[msgIdx]);
      }
    }, 5000);

    return () => {
      clearInterval(msgInterval);
    };
  }, [activeAlert]);

  // Periodic Anomaly Simulator (Realistic cybersecurity / telemetry event)
  useEffect(() => {
    let alertTimeout;
    const anomalyInterval = setInterval(() => {
      // Pick FDR-GW-03 or DC-EDGE for anomaly
      const targetNodeId = Math.random() > 0.5 ? 'FDR-GW-03' : 'DC-EDGE';
      const nodeLabel = targetNodeId === 'FDR-GW-03' ? 'FDR-GW-03' : 'DC-EDGE-A';
      
      const newAlert = {
        nodeId: targetNodeId,
        nodeLabel,
        title: 'Uplink Ingest Spike Detected',
        subtext: 'KavachIQ AI evaluating flow signature',
        stage: 'detected', // 'detected' -> 'mitigating' -> 'resolved'
        timestamp: Date.now()
      };

      setActiveAlert(newAlert);
      setLiveEventMessage(`⚠ Alert: ${nodeLabel} Traffic Fluctuation Evaluated`);

      // After 3.5s, AI correlates and normalizes
      alertTimeout = setTimeout(() => {
        setActiveAlert((prev) => prev ? { ...prev, stage: 'mitigated', title: 'Flow Verified • MITRE 0 Anomaly' } : null);
        setLiveEventMessage('✓ Anomaly Contained • Zero Threat Ingress');

        // Clear alert after 2.5s
        setTimeout(() => {
          setActiveAlert(null);
        }, 2500);
      }, 3500);

    }, 22000); // Triggers every 22s for an organic feel without overwhelming

    return () => {
      clearInterval(anomalyInterval);
      if (alertTimeout) clearTimeout(alertTimeout);
    };
  }, []);

  // Performance: Intersection Observer to pause canvas when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Center KavachIQ Core Coordinates
    const getCenter = () => ({
      x: width * 0.5,
      y: height * 0.5,
      radius: Math.min(width, height) * 0.125
    });

    const particles = [];
    const maxParticles = 38;

    // Seed initial particles
    DEFAULT_NODES.forEach((node) => {
      for (let i = 0; i < 4; i++) {
        particles.push({
          nodeId: node.id,
          progress: Math.random(),
          speed: 0.0035 + Math.random() * 0.0045,
          direction: Math.random() > 0.15 ? 'in' : 'out', // mostly in towards core
          colorType: 'cyan',
          size: 2.2 + Math.random() * 1.5,
          tailLength: 0.06 + Math.random() * 0.04,
          pulseRate: 0.8 + Math.random() * 0.5
        });
      }
    });

    let startTime = performance.now();
    let lastFrameTime = startTime;
    let radarAngle = 0;
    let coreGlowPulse = 0;

    const render = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const delta = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;

      // Handle canvas resize if dimensions changed
      const rect = canvas.getBoundingClientRect();
      if (rect.width !== width || rect.height !== height) {
        resize();
      }

      ctx.clearRect(0, 0, width, height);

      const center = getCenter();
      const isAlerting = !!activeAlert;
      const alertNodeId = activeAlert ? activeAlert.nodeId : null;

      // 1. Subtle Technical Grid & Radar Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(30, 58, 110, 0.22)';
      ctx.lineWidth = 1;

      // Concentric Observability Scan Rings
      const ringRadii = [
        center.radius * 1.35,
        center.radius * 1.9,
        center.radius * 2.5,
        center.radius * 3.1
      ];

      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(0, 163, 224, 0.12)' : 'rgba(30, 58, 110, 0.18)';
        ctx.setLineDash(idx % 2 === 0 ? [3, 6] : [6, 8]);
        ctx.stroke();
      });

      // Subtle slow rotating radar scan cone
      if (!prefersReducedMotion) {
        radarAngle = (radarAngle + delta * 0.45) % (Math.PI * 2);
        const scanGrad = ctx.createRadialGradient(
          center.x, center.y, 0,
          center.x, center.y, ringRadii[3]
        );
        scanGrad.addColorStop(0, 'rgba(0, 163, 224, 0.08)');
        scanGrad.addColorStop(0.7, 'rgba(0, 112, 173, 0.03)');
        scanGrad.addColorStop(1, 'rgba(0, 112, 173, 0)');

        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.arc(center.x, center.y, ringRadii[3], radarAngle - 0.4, radarAngle);
        ctx.closePath();
        ctx.fillStyle = scanGrad;
        ctx.fill();
      }

      ctx.restore();

      // 2. Render Connection Lines Between Nodes & Core
      DEFAULT_NODES.forEach((node) => {
        const nodeX = node.x * width;
        const nodeY = node.y * height;
        const isThisAlerting = isAlerting && alertNodeId === node.id;
        const isHovered = hoveredNode && hoveredNode.id === node.id;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodeX, nodeY);
        ctx.lineTo(center.x, center.y);

        if (isThisAlerting) {
          // Warning/Alert Line
          ctx.strokeStyle = 'rgba(245, 130, 32, 0.85)';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#F58220';
          ctx.shadowBlur = 10;
          ctx.setLineDash([4, 4]);
        } else if (isHovered) {
          // Hover Highlighted Line
          ctx.strokeStyle = 'rgba(0, 163, 224, 0.9)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00A3E0';
          ctx.shadowBlur = 8;
          ctx.setLineDash([]);
        } else {
          // Normal Telemetry Line
          ctx.strokeStyle = 'rgba(0, 163, 224, 0.22)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 5]);
        }
        ctx.stroke();
        ctx.restore();
      });

      // 3. Render and Update Live Particles (Data Packets)
      if (!prefersReducedMotion) {
        particles.forEach((p) => {
          const node = DEFAULT_NODES.find((n) => n.id === p.nodeId);
          if (!node) return;

          const isNodeAlert = isAlerting && alertNodeId === node.id;
          const nodeX = node.x * width;
          const nodeY = node.y * height;

          // Advance particle position
          p.progress += p.speed * (isNodeAlert ? 1.6 : 1);
          if (p.progress >= 1) {
            p.progress = 0;
            // Chance to toggle direction or vary speed
            p.direction = Math.random() > 0.12 ? 'in' : 'out';
            p.speed = 0.0035 + Math.random() * 0.0045;
            
            // If particle arrived at center, trigger subtle core pulse
            if (p.direction === 'in') {
              coreGlowPulse = Math.min(1.0, coreGlowPulse + 0.18);
            }
          }

          // Calculate current coords
          const t = p.progress;
          const actualT = p.direction === 'in' ? t : 1 - t;
          const currentX = nodeX + (center.x - nodeX) * actualT;
          const currentY = nodeY + (center.y - nodeY) * actualT;

          // Tail coords for dynamic speed comet effect
          const tailT = Math.max(0, actualT - (p.direction === 'in' ? p.tailLength : -p.tailLength));
          const tailX = nodeX + (center.x - nodeX) * tailT;
          const tailY = nodeY + (center.y - nodeY) * tailT;

          // Color determination
          let pColor = '#00A3E0';
          let glowColor = 'rgba(0, 163, 224, 0.8)';
          if (isNodeAlert) {
            pColor = activeAlert.stage === 'mitigated' ? '#10B981' : '#F58220';
            glowColor = activeAlert.stage === 'mitigated' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 130, 32, 0.9)';
          } else if (node.id === 'SIEM-INGEST') {
            pColor = '#10B981'; // SIEM Green
            glowColor = 'rgba(16, 185, 129, 0.7)';
          } else if (node.id === 'RTR-CORE') {
            pColor = '#38BDF8';
            glowColor = 'rgba(56, 189, 248, 0.8)';
          }

          ctx.save();
          // Draw Comet Stream Tail
          const gradient = ctx.createLinearGradient(tailX, tailY, currentX, currentY);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
          gradient.addColorStop(1, glowColor);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.size;
          ctx.stroke();

          // Draw Glowing Packet Head
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = pColor;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = isNodeAlert ? 12 : 6;
          ctx.fill();
          ctx.restore();
        });
      }

      // Decay core glow pulse
      coreGlowPulse = Math.max(0, coreGlowPulse - delta * 0.9);

      // 4. Render Central KavachIQ Telemetry Core
      ctx.save();
      const basePulse = Math.sin(elapsed * 2.5) * 0.08;
      const coreR = center.radius * (1 + basePulse + coreGlowPulse * 0.12);

      // Outer Core Halo Glow
      const coreAura = ctx.createRadialGradient(
        center.x, center.y, coreR * 0.4,
        center.x, center.y, coreR * 2.2
      );
      if (isAlerting && activeAlert.stage !== 'mitigated') {
        coreAura.addColorStop(0, 'rgba(245, 130, 32, 0.35)');
        coreAura.addColorStop(0.6, 'rgba(245, 130, 32, 0.12)');
        coreAura.addColorStop(1, 'rgba(245, 130, 32, 0)');
      } else {
        coreAura.addColorStop(0, 'rgba(0, 163, 224, 0.35)');
        coreAura.addColorStop(0.5, 'rgba(43, 27, 129, 0.2)');
        coreAura.addColorStop(1, 'rgba(11, 27, 61, 0)');
      }
      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(center.x, center.y, coreR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Core Background Circle with Metallic Border
      ctx.beginPath();
      ctx.arc(center.x, center.y, coreR, 0, Math.PI * 2);
      const coreGrad = ctx.createLinearGradient(
        center.x - coreR, center.y - coreR,
        center.x + coreR, center.y + coreR
      );
      coreGrad.addColorStop(0, '#132B5E');
      coreGrad.addColorStop(1, '#0B1B3D');
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isAlerting && activeAlert.stage !== 'mitigated' ? '#F58220' : '#00A3E0';
      ctx.shadowColor = isAlerting && activeAlert.stage !== 'mitigated' ? '#F58220' : '#00A3E0';
      ctx.shadowBlur = 14 + coreGlowPulse * 10;
      ctx.stroke();

      // Inner Core Concentric Active Ring
      ctx.beginPath();
      ctx.arc(center.x, center.y, coreR * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Draw Center Shield / Identity Symbol
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.max(10, Math.floor(coreR * 0.3))}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KAVACH', center.x, center.y - coreR * 0.18);
      
      ctx.font = `600 ${Math.max(8, Math.floor(coreR * 0.22))}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = isAlerting && activeAlert.stage !== 'mitigated' ? '#FFA34D' : '#38BDF8';
      ctx.fillText('AI CORE', center.x, center.y + coreR * 0.22);

      // Core Status Indicator Dot
      ctx.beginPath();
      ctx.arc(center.x, center.y + coreR * 0.52, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isAlerting && activeAlert.stage !== 'mitigated' ? '#F58220' : '#10B981';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.restore();

      // 5. Render Surrounding Network Nodes
      DEFAULT_NODES.forEach((node, idx) => {
        const nodeX = node.x * width;
        const nodeY = node.y * height;
        const isThisAlerting = isAlerting && alertNodeId === node.id;
        const isHovered = hoveredNode && hoveredNode.id === node.id;
        const nodeRadius = isHovered ? 15 : 12;

        // Individual staggered breathing pulse per node
        const nodePulse = Math.sin(elapsed * 2 + idx * 0.8) * 2.5;

        ctx.save();

        // Node Glow Ring
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius + 5 + Math.max(0, nodePulse), 0, Math.PI * 2);
        if (isThisAlerting) {
          ctx.fillStyle = activeAlert.stage === 'mitigated' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 130, 32, 0.35)';
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(0, 163, 224, 0.3)';
        } else {
          ctx.fillStyle = 'rgba(19, 43, 94, 0.4)';
        }
        ctx.fill();

        // Node Solid Disk
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#0B1B3D';
        ctx.fill();

        // Node Border
        ctx.lineWidth = isHovered || isThisAlerting ? 2.2 : 1.5;
        if (isThisAlerting) {
          ctx.strokeStyle = activeAlert.stage === 'mitigated' ? '#10B981' : '#F58220';
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 10;
        } else if (isHovered) {
          ctx.strokeStyle = '#38BDF8';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(0, 163, 224, 0.6)';
          ctx.shadowColor = 'rgba(0, 163, 224, 0.4)';
          ctx.shadowBlur = 4;
        }
        ctx.stroke();

        // Center Status Pip
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isThisAlerting ? (activeAlert.stage === 'mitigated' ? '#10B981' : '#F58220') : '#10B981';
        ctx.fill();

        // Node Label Pill below / above node
        ctx.shadowBlur = 0;
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = isThisAlerting ? '#FFA34D' : (isHovered ? '#FFFFFF' : '#CBD5E1');
        
        // Position label intelligently so it doesn't collide with canvas edges
        const labelY = node.y > 0.7 ? nodeY - nodeRadius - 8 : nodeY + nodeRadius + 12;
        ctx.fillText(node.label, nodeX, labelY);

        ctx.restore();
      });

    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, [hoveredNode, activeAlert, prefersReducedMotion]);

  // Handle Mouse Hover on Canvas for Node Tooltips
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = null;
    const hitRadius = 24;

    for (const node of DEFAULT_NODES) {
      const nodeX = node.x * rect.width;
      const nodeY = node.y * rect.height;
      const dist = Math.hypot(x - nodeX, y - nodeY);
      if (dist < hitRadius) {
        found = node;
        setTooltipPos({ x: nodeX, y: nodeY });
        break;
      }
    }

    setHoveredNode(found);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl bg-gts-navy text-white shadow-2xl border border-slate-700/70 overflow-hidden select-none ${className}`}
    >
      {/* Ambient Cybernetic Gradient Backlights */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gts-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gts-purple/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1E3A6E_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.25] pointer-events-none" />

      {/* 1. TOP TELEMETRY CORE HEADER BAR (Preserved with enhanced indicators) */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-slate-700/80 bg-slate-950/40 backdrop-blur-sm text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-tight text-slate-100">KavachIQ Telemetry Core</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono uppercase bg-blue-950/80 text-cyan-300 border border-blue-800/60 rounded">
              Active Mesh
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 text-[10px] font-mono text-gts-orange font-bold border border-slate-700/80 shadow-sm">
            <Lock className="w-3 h-3 text-gts-orange animate-pulse" />
            <span>AIR-GAP ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. LIVE INTERACTIVE NETWORK TOPOLOGY CANVAS VIEWPORT */}
      <div className="relative w-full h-[360px] sm:h-[410px] lg:h-[430px] z-10 overflow-hidden bg-slate-950/30">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block cursor-crosshair"
          title="KavachIQ Live Network Observability Canvas"
        />

        {/* Live Event Pill (Top Left overlay on canvas) */}
        <div className="absolute top-3 left-4 pointer-events-none z-20 transition-all duration-300">
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono backdrop-blur-md border shadow-lg transition-all duration-300 ${
            activeAlert 
              ? (activeAlert.stage === 'mitigated' 
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' 
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300 animate-pulse')
              : 'bg-slate-900/80 border-slate-700/70 text-slate-300'
          }`}>
            <span>{liveEventMessage}</span>
          </div>
        </div>

        {/* Live Anomaly Detection Banner (Floating overlay when alert triggers) */}
        {activeAlert && (
          <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 z-30 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-mono shadow-2xl ${
              activeAlert.stage === 'mitigated'
                ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-200'
                : 'bg-amber-950/90 border-amber-500/70 text-amber-200'
            }`}>
              {activeAlert.stage === 'mitigated' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{activeAlert.nodeLabel} • {activeAlert.title}</div>
                <div className="text-[10px] opacity-80 truncate">{activeAlert.subtext}</div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Node Tooltip on Canvas Hover */}
        {hoveredNode && (
          <div
            className="absolute z-40 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1 transform -translate-x-1/2 -translate-y-full mb-3 min-w-[190px]"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-cyan-300 font-bold">
              <span>{hoveredNode.label}</span>
              <span className="text-[10px] px-1 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                {hoveredNode.tag}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">{hoveredNode.type}</div>
            <div className="grid grid-cols-2 gap-1 pt-1 text-[10px] text-slate-300">
              <div>Throughput: <span className="text-white font-bold">{hoveredNode.eps}</span></div>
              <div>Latency: <span className="text-emerald-400 font-bold">{hoveredNode.latency}</span></div>
            </div>
            <div className="text-[10px] text-slate-400">
              Interfaces: <span className="text-slate-200">{hoveredNode.interfaces}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
