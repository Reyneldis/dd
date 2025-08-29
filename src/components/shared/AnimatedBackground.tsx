const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen min-h-screen min-w-full pointer-events-none overflow-hidden">
      {/* Blobs animados */}
      <div
        className="absolute h-[60vw] w-[60vw] max-w-[900px] max-h-[900px] left-[-20vw] top-[-10vw] rounded-full opacity-60 blur-3xl animate-[blob1_18s_ease-in-out_infinite] 
        bg-[#2563eb]/60 mix-blend-lighten dark:bg-[#7c3aed]/50"
      />
      <div
        className="absolute h-[40vw] w-[40vw] max-w-[700px] max-h-[700px] right-[-15vw] bottom-[-10vw] rounded-full opacity-50 blur-2xl animate-[blob2_22s_ease-in-out_infinite] 
        bg-[#fbbf24]/40 mix-blend-lighten dark:bg-[#f472b6]/40"
      />
      <div
        className="absolute h-[30vw] w-[30vw] max-w-[500px] max-h-[500px] left-[40vw] top-[60vh] rounded-full opacity-40 blur-2xl animate-[blob3_26s_ease-in-out_infinite] 
        bg-[#38bdf8]/40 mix-blend-lighten dark:bg-[#a5b4fc]/40"
      />
      {/* Patrón sutil encima de los blobs */}
      <div
        className="absolute inset-0 h-full w-full animate-[movePattern_20s_linear_infinite]
        bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)]
        bg-[size:5rem_3rem]"
      />
      <style>{`
        @keyframes movePattern {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 10rem 6rem, 10rem 6rem; }
        }
        @keyframes blob1 {
          0%, 100% { left: -20vw; top: -10vw;}
          66% { left: -10vw; top: 30vw; }
        }
        @keyframes blob2 {
          0%, 100% { right: -15vw; bottom: -10vw; }
          33% { right: 10vw; bottom: 10vw; }
          66% { right: 30vw; bottom: 30vw; }
        }
        @keyframes blob3 {
          0%, 100% { left: 40vw; top: 60vh; }
          33% { left: 60vw; top: 40vh; }
          66% { left: 20vw; top: 30vh; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
