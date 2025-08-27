import * as React from "react";

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ src, alt, className, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src || "/file.svg"}
        alt={alt || "Avatar"}
        className={
          "rounded-full border border-gray-200 object-cover bg-gray-100 " + (className || "")
        }
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";
