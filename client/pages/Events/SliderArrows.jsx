export const PrevArrow = () => (
  <button
    className="custom-prev absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20
               w-14 h-14 rounded-full bg-black/40 backdrop-blur
               flex items-center justify-center
               hover:bg-vp-gold transition-all group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white group-hover:text-vp-dark transition"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

export const NextArrow = () => (
  <button
    className="custom-next absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20
               w-14 h-14 rounded-full bg-black/40 backdrop-blur
               flex items-center justify-center
               hover:bg-vp-gold transition-all group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white group-hover:text-vp-dark transition"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);