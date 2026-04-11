import { cn } from "@/lib/utils";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

interface PilotAvatarProps {
  name: string;
  profilePhoto?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-14 w-14 text-lg",
  md: "h-20 w-20 text-2xl",
  lg: "h-24 w-24 text-3xl",
};

const PilotAvatar = ({ name, profilePhoto, className, size = "sm" }: PilotAvatarProps) => {
  if (profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-primary/20", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary ring-2 ring-primary/20",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default PilotAvatar;
