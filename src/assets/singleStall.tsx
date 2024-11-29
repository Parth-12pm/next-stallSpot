import { StallProps } from "@/components/stall";

const SingleStall = ({ className, width, height }: StallProps) => {
  return (
    <svg 
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
    >
  <svg className="singleStall" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M195,5V95H5V5H195m5-5H0V100H200V0Z"/></g></g></svg>
    </svg>
  );
};



export default SingleStall;
