import { StallProps } from "@/components/stall";

const DoubleStall = ({ className, width, height }: StallProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg
        className="doubleStall"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 195"
      >
        <defs>
          <style>{`.cls-1 { opacity: 0.25; }`}</style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <g id="Layer_2-2" data-name="Layer 2">
              <g id="Layer_1-2-2" data-name="Layer 1-2">
                <path d="M0,0V195H200V0ZM195,190H5V5H195Z" />
              </g>
            </g>
            <rect className="cls-1" x="5" y="97" width="190" height="1" />
          </g>
        </g>
      </svg>
    </svg>
  );
};

export default DoubleStall;
