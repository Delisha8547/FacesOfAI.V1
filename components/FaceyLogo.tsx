const FaceyLogo = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform hover:scale-110`}
    fill="none"
  >
    {/* Indigo background */}
    <rect width="200" height="200" rx="28" fill="#4F46E5" />

    {/* Monitor frame */}
    <rect
      x="25"
      y="35"
      width="150"
      height="105"
      rx="14"
      stroke="white"
      strokeWidth="8"
    />

    {/* Heart */}
    <path
      d="M100 18
         C94 6, 72 8, 72 26
         C72 40, 100 56, 100 56
         C100 56, 128 40, 128 26
         C128 8, 106 6, 100 18Z"
      fill="white"
    />

    {/* Eyes */}
    <path
      d="M60 80 C70 70, 90 70, 100 80"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M100 80 C110 70, 130 70, 140 80"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Smile */}
    <path
      d="M85 100 C95 115, 110 115, 120 105"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Blush */}
    <circle cx="65" cy="105" r="10" fill="white" opacity="0.25" />
    <circle cx="135" cy="105" r="10" fill="white" opacity="0.25" />

    {/* Stand */}
    <rect x="90" y="140" width="20" height="20" fill="white" />
    <rect x="70" y="160" width="60" height="10" rx="5" fill="white" />
  </svg>
);

export default FaceyLogo;
