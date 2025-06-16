import type React from "react";

const BackgroundCircles: React.FC = () => {
  return (
    <>
      {/* Círculos para DESKTOP */}
      <div className="hidden lg:block fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-[-150px] bottom-[80px] w-[340px] h-[340px] bg-[#F9AE2B] rounded-full" />
        <div className="absolute left-[80px] bottom-[-150px] w-[340px] h-[340px] bg-[#A30D19] rounded-full" />
        <div className="absolute left-[-150px] bottom-[-150px] w-[380px] h-[380px] bg-[#0A2367] rounded-full" />
      </div>

      {/* Círculos para MÓVIL */}
      <div className="block lg:hidden fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Superiores */}
        <div className="absolute right-[-70px] top-[10px] w-[200px] h-[200px] bg-[#F9AE2B] rounded-full" />
        <div className="absolute right-[40px] top-[-100px] w-[180px] h-[180px] bg-[#A30D19] rounded-full" />
        <div className="absolute right-[-100px] top-[-100px] w-[200px] h-[200px] bg-[#0A2367] rounded-full" />

        {/* Inferiores */}
        <div className="absolute left-[-50px] bottom-[-170px] w-[200px] h-[200px] bg-[#F9AE2B] rounded-full" />
        <div className="absolute right-[-50px] bottom-[-140px] w-[180px] h-[180px] bg-[#A30D19] rounded-full" />
        <div className="absolute left-[100px] bottom-[-190px] w-[260px] h-[260px] bg-[#0A2367] rounded-full" />
      </div>
    </>
  );
};

export default BackgroundCircles;
