  {/* FIXED Header and Action Buttons */}
  <div className="relative flex flex-col items-center bg-[url('/images/nebula-background.png')] bg-cover bg-center p-10 my-8 rounded-3xl shadow-xl w-full overflow-hidden">
  <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white mb-6 relative text-center">
    Application Settings
    <span className="absolute inset-0 bg-gradient-to-r from-white to-silver opacity-15 blur-md transform scale-105 animate-pulse" />
  </h2>

  <div className="flex gap-6 mb-6">
    <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-green-500 to-green-600 text-white`}>
      Save
    </button>

    <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-blue-500 to-blue-600 text-white`}>
      Deploy
    </button>

    <button className={`relative overflow-hidden px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-gray-500 to-gray-600 text-white`}>
      Cancel
    </button>
  </div>

  {/* Silver Particles */}
  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
    <div className="silver-particle"></div>
    <div className="silver-particle"></div>
    <div className="silver-particle"></div>
    <div className="silver-particle"></div>
    <div className="silver-particle"></div>
  </div>
</div>


  <style jsx>{`
    h2 {
      position: relative;
      text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    h2::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to right, rgba(255, 0, 0, 0.1), rgba(0, 0, 255, 0.1));
      filter: blur(10px);
      z-index: -1;
      animation: smoothPulse 2.5s infinite ease-in-out;
    }

    @keyframes smoothPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.2;
      }
      50% {
        transform: scale(1.02);
        opacity: 0.5;
      }
    }

    /* Silver Particles */
    .silver-particle {
      position: absolute;
      top: -10%; /* Start above the container */
      width: 5px; /* Width of the particle */
      height: 5px; /* Height of the particle */
      border-radius: 50%; /* Make it circular */
      background: linear-gradient(to bottom, rgba(192, 192, 192, 1), rgba(192, 192, 192, 0));
      animation: fall linear infinite;
      z-index: 1; /* Ensure particles are above the background */
    }

    @keyframes fall {
      0% {
        transform: translateY(0);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh); /* Fall to the bottom of the viewport */
        opacity: 0;
      }
    }

    /* Randomize the particles */
    .silver-particle:nth-child(1) {
      left: 10%; 
      animation-duration: 3s;
      animation-delay: 0s;
    }

    .silver-particle:nth-child(2) {
      left: 30%;
      animation-duration: 4s;
      animation-delay: 0.5s;
    }

    .silver-particle:nth-child(3) {
      left: 50%;
      animation-duration: 2.5s;
      animation-delay: 1s;
    }

    .silver-particle:nth-child(4) {
      left: 70%;
      animation-duration: 3.5s;
      animation-delay: 1.5s;
    }

    .silver-particle:nth-child(5) {
      left: 90%;
      animation-duration: 4.5s;
      animation-delay: 2s;
    }
  `}</style>