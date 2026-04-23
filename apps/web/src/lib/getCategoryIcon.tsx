import {
  Coffee,
  Dumbbell,
  Heart,
  Palette,
  Scissors,
  Sparkles,
} from "lucide-react";

const ToothIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
  >
    <path d="M7 5.5c1.5-1 2.9-1.5 5-1.5s3.5.5 5 1.5c1.8 1.2 2.3 3.4 1.9 5.4-.4 2.2-1.4 4.2-2.5 6.2-.8 1.4-1.4 2.9-2.8 2.9-1.2 0-1.6-1.1-1.6-2.3V16c0-.6-.4-1-1-1s-1 .4-1 1v1.7c0 1.2-.4 2.3-1.6 2.3-1.4 0-2-1.5-2.8-2.9-1.1-2-2.1-4-2.5-6.2-.4-2 .1-4.2 1.9-5.4Z" />
  </svg>
);

const categoryIcons: Record<string, React.ReactNode> = {
  scissors: <Scissors className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  tooth: <ToothIcon className="w-6 h-6" />,
};

export const resolveCategoryIcon = (iconName?: string) => {
  if (!iconName) return categoryIcons["sparkles"];

  const key = iconName.toLowerCase().trim();

  if (categoryIcons[key]) return categoryIcons[key];
  if (key.includes("hair")) return categoryIcons["scissors"];
  if (key.includes("beauty")) return categoryIcons["heart"];
  if (key.includes("nail")) return categoryIcons["palette"];
  if (key.includes("gym")) return categoryIcons["dumbbell"];
  if (key.includes("coffee")) return categoryIcons["coffee"];
  if (key.includes("dent")) return categoryIcons["tooth"];

  return categoryIcons["sparkles"];
};
