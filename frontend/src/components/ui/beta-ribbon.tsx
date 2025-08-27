const BetaRibbon = () => {
  return (
    <div
      className="fixed top-0 left-0 w-[120px] h-[120px] overflow-hidden pointer-events-none z-50"
      aria-label="Beta Version"
    >
      <div className="absolute top-[30px] left-[-35px] w-[170px] transform -rotate-45 bg-gradient-to-r from-amber-400 to-yellow-500 text-center py-2 shadow-lg">
        <span className="text-black font-semibold text-sm tracking-wider">
          BETA
        </span>
      </div>
    </div>
  );
};

export default BetaRibbon;
