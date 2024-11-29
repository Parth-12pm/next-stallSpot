import { StallProps } from "@/components/stall";

const VerticalDoubleStall = ({ className, width, height }: StallProps) => {
  return (
    <svg 
      className={className}
      width={width}
      height={height}
      viewBox="0 0 100 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`.cls-1 { opacity: 0.25; }`}</style>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g id="Layer_2-2" data-name="Layer 2">
            <g id="Layer_1-2-2" data-name="Layer 1-2">
              <path d="M0,0V395H100V0ZM95,390H5V5H95Z" />
            </g>
          </g>
          <rect className="cls-1" x="5" y="197" width="90" height="1" />
        </g>
      </g>
    </svg>
  );
};

export default VerticalDoubleStall;
