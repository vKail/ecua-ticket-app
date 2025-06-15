import React from "react";

const BackgroundCircles: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      <div
        className="absolute left-[-150px] bottom-[80px] w-[340px] h-[340px] rounded-full"
        style={{ backgroundColor: "#F9AE2B" }}
      />

      <div
        className="absolute left-[80px] bottom-[-150px] w-[340px] h-[340px] rounded-full"
        style={{ backgroundColor: "#A30D19" }}
      />

      <div
        className="absolute left-[-150px] bottom-[-150px] w-[380px] h-[380px] rounded-full"
        style={{ backgroundColor: "#0A2367" }}
      />
    </div>
  );
};

export default BackgroundCircles;
