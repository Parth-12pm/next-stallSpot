import { StallProps } from "@/components/stall";

const Lstall = ({ className, width, height }: StallProps) => {
  return (
    <svg 
      className={className}
      width={width}
      height={height}
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Your SVG path */}
      <svg className="w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 295">
        <defs>
          <style>{`.cls-1 { opacity: 0.25; }  `}</style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <g id="Layer_2-2" data-name="Layer 2">
              <g id="Layer_1-2-2" data-name="Layer 1-2">
                <path d="M100,195V0H0V295H200V195Zm95,95H5V5H95V200H195Z"/>
              </g>
            </g>
            <rect className="cls-1" x="5" y="199" width="90" height="1"/>
          </g>
        </g>
      </svg>
    </svg>
  );
};

export default Lstall;
  