import React, { useEffect, useRef, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

export default function ConnectionStrengthScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [userName, setUserName] = useState(null);
  // fetch from your backend
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return setUserName('Guest');

    fetch(`http://127.0.0.1:8000/test-execution/get-user/${id}/`)
      .then(res => res.json())
      .then(profile => setUserName(profile.name))
      .catch(() => setUserName('Guest'));
  }, []);
  // live quality state
  const [videoBars, setVideoBars] = useState(0);
  const [audioBars, setAudioBars] = useState(0);
  const [netBars, setNetBars] = useState(5);

  // peer connection & audio analyser refs
  const pcRef = useRef(null);
  const analyserRef = useRef(null);


  useEffect(() => {
  const handlePermissionChange = async () => {
    try {
      const micStatus = await navigator.permissions.query({ name: 'microphone' });
      const camStatus = await navigator.permissions.query({ name: 'camera' });

      const listener = () => {
        console.warn("Permission changed, reloading...");
        window.location.reload();
      };

      micStatus.onchange = listener;
      camStatus.onchange = listener;

      return () => {
        micStatus.onchange = null;
        camStatus.onchange = null;
      };
    } catch (err) {
      console.error("Permission check failed:", err);
    }
  };

  handlePermissionChange();
}, []);

  useEffect(() => {
    let statInterval, audioInterval;
    async function setup() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(media);
        // assign stream to video once
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = media;
        }

        // audio analyser setup
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(media);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        analyserRef.current = analyser;

        // peer connection for network stats
        const pc = new RTCPeerConnection();
        media.getTracks().forEach((track) => pc.addTrack(track, media));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await pc.setRemoteDescription(offer);
        pcRef.current = pc;

        statInterval = setInterval(pollStats, 3000);
        audioInterval = setInterval(pollAudio, 200);
      } catch (e) {
        console.error(e);
      }
    }
    setup();
    return () => {
      clearInterval(statInterval);
      clearInterval(audioInterval);
      if (analyserRef.current) analyserRef.current.disconnect();
      if (pcRef.current) pcRef.current.close();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const pollStats = async () => {
    const pc = pcRef.current;
    if (!pc) return;

    const stats = await pc.getStats();
    let videoSent = 0, videoLost = 0, videoFPS = 0;
    let rtt = 0, netSent = 0, netLost = 0;

    stats.forEach((report) => {
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        videoSent += report.packetsSent || 0;
        videoLost += report.packetsLost || 0;
        if (report.framesPerSecond) videoFPS = report.framesPerSecond;
      }
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        rtt = report.currentRoundTripTime || rtt;
      }
      if (report.type === 'outbound-rtp' && report.kind === 'audio') {
        netSent += report.packetsSent || 0;
        netLost += report.packetsLost || 0;
      }
    });

    // Calculate video packet loss and FPS level (scale FPS roughly 0-5 bars)
    const videoLoss = videoSent ? videoLost / videoSent : 0;
    const videoLossLevel = Math.max(1, 5 - Math.ceil(videoLoss * 5));
    const fpsLevel = Math.min(5, Math.max(1, Math.round((videoFPS / 30) * 5)));
    const videoLevel = Math.round((videoLossLevel + fpsLevel) / 2);
    const netLoss = netSent ? netLost / netSent : 0;
    const netLossLevel = Math.max(1, 5 - Math.ceil(netLoss * 5));
    const rttLevel = rtt ? Math.max(1, 5 - Math.floor(rtt * 5)) : 5;
    const netLevel = Math.round((netLossLevel + rttLevel) / 2);

    setVideoBars(videoLevel);
    setNetBars(netLevel);

    console.log('Video packet loss:', videoLoss, 'FPS:', videoFPS, 'Video Level:', videoLevel);
    console.log('Network packet loss:', netLoss, 'RTT:', rtt, 'Network Level:', netLevel);

    if (videoLevel <= 2 || netLevel <= 2) {
      console.warn("⚠️ Low video/network quality");
    }
  };

  const pollAudio = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let v of data) {
      const norm = (v - 128) / 128;
      sum += norm * norm;
    }
    const rms = Math.sqrt(sum / data.length);
    const level = Math.min(5, Math.max(1, Math.ceil(rms * 50)));
    setAudioBars(level);
    console.log('Audio RMS:', rms, 'Audio Level:', level);
  };

  const renderBars = (count, type = 'teal') => {
    const filledClass = type === 'teal' ? 'bg-teal-600' : 'bg-orange-600';
    const emptyClass = type === 'teal' ? 'bg-teal-200' : 'bg-orange-200';
    return Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        style={{ width: '7.25px', height: '36px' }}
        className={`${i < count ? filledClass : emptyClass} rounded-sm`}
      />
    ));
  };
  const handleAccept = () => navigate('/demoquestion');
  const data = [
    { title: 'Your camera is ready to record.', subtitle: 'Ensure you have good lighting for a clear video.' },
    { title: 'Your microphone is working properly.', subtitle: 'Make sure your surroundings are quiet to capture clear audio.' },
    { title: 'Your internet connection is stable.', subtitle: 'A strong connection ensures a smooth interview experience.' }
  ];

  return (
    <div className="relative w-screen h-screen bg-white overflow-auto font-overpass">
      <div className="sticky top-0 w-full flex h-1 z-10">
        <div className="flex-1 bg-red-500" />
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-lime-400" />
        <div className="flex-1 bg-cyan-500" />
      </div>
      <header className="flex items-center justify-between px-20 py-4">
        <div className="w-40 h-6 bg-gray-300" />
        <div className="flex items-center gap-4">
          <button className="flex items-center px-5 py-2 border border-[#E0302D] rounded-full bg-[#E0302D0D] gap-2">
            <FaQuestionCircle className="text-[#E0302D] text-xl" />
            <span className="text-[#E0302D] text-base font-medium">FAQs</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <img src="images/profilepic.png" alt="Avatar" className="w-6 h-6 rounded-full" />
            <span className="text-gray-900 text-base font-medium">{userName ?? 'Loading...'}</span>
          </div>
        </div>
      </header>
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold text-gray-900">Check Your Connection Strength</h1>
        <p className="mt-2 text-lg text-gray-600 max-w-xl mx-auto">Ensure optimal performance by checking your video, microphone, and internet connection strengths.</p>
      </div>
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 px-4 mt-10 max-w-[1100px] mx-auto">
        <div className="relative w-full md:w-1/2 bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
          <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>
          <p className="mt-4 font-semibold text-gray-900">{data[0].title}</p>
          <p className="text-sm text-gray-600 mt-1">{data[0].subtitle}</p>
          <div className="absolute bottom-6 right-6 flex space-x-1">
            {renderBars(videoBars, 'teal')}
          </div>
        </div>
        <div className="flex flex-col gap-12 w-full md:w-1/3">
          <div className="relative bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
            <p className="font-semibold text-gray-900">{data[1].title}</p>
            <p className="text-sm text-gray-600 mt-1">{data[1].subtitle}</p>
            <div className="flex space-x-1 mt-4">{renderBars(audioBars, 'orange')}
            </div>
          </div>
          <div className="relative bg-blue-50 p-6 rounded-xl drop-shadow-md border-b-4 border-r-4 border-teal-400">
            <p className="font-semibold text-gray-900">{data[2].title}</p>
            <p className="text-sm text-gray-600 mt-1">{data[2].subtitle}</p>
            <div className="flex space-x-1 mt-4">{renderBars(netBars, 'teal')}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10 mb-10">
        <button onClick={handleAccept} className="px-10 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold">Next</button>
      </div>
    </div>
  );
}
