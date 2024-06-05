// Primary button - colored background and white text
const CTAButton = ({ text, onClick, disabled, disabledText }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="border-blueink text-white min-w-14 bg-blueink border-2 py-2 px-5 shadow rounded-xl w-full disabled:bg-disabledBlueink transition-all "
    >
      {disabled ? disabledText : text}
    </button>
  );
};

export default CTAButton;
