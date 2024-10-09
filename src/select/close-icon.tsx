interface ICloseIcon {
  size?: number;
}
const CloseIcon = ({ size = 16 }: ICloseIcon) => {
  return (
    <svg
      className="zener-outline-none"
      focusable="false"
      data-icon="close"
      width={size}
      height={size}
      strokeWidth="2"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M24 8 8 24M24 24 8 8"
      />
    </svg>
  );
};

export default CloseIcon;
