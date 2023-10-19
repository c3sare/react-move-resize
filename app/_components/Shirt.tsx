import clsx from "clsx";

type ShirtProps = {
  isDragging?: boolean;
  children?: React.ReactNode;
};

const Shirt: React.FC<ShirtProps> = ({ isDragging, children }) => {
  return (
    <div
      className={clsx(
        "w-[200px] h-[240px] mx-auto border absolute border-dashed top-[142px] left-1/2 translate-x-[-50%]",
        isDragging ? "border-[#0e5e8e]" : "border-transparent",
        isDragging &&
          "after:z-[5] after:block after:contents-[''] after:w-[1px] after:h-full after:absolute after:top-0 after:left-1/2 after:border-l after:border-dashed after:border-l-[#0e5e8e]",
        isDragging &&
          "before:z-[5] before:block before:contents-[''] before:h-[1px] before:w-full before:absolute before:left-0 before:top-1/2 before:border-t before:border-dashed before:border-t-[#0e5e8e]"
      )}
    >
      {children}
    </div>
  );
};

export default Shirt;
