import React from "react";
import { Stars } from "lucide-react";

const ResponsiveStar = ({ zoom }) => {
  // Base size when zoom is 1
  const baseSize = 15;
  // Calculate size based on zoom, with a minimum size of 10
  const size = Math.max(baseSize * zoom, 10);

  return <Stars size={size} className="text-gray-600 dark:text-gray-300" />;
};

export default ResponsiveStar;
