import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colorClasses = {
  blue: {
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    accent: "text-blue-600",
  },
  green: {
    iconBg: "bg-green-100",
    icon: "text-green-600",
    accent: "text-green-600",
  },
  purple: {
    iconBg: "bg-purple-100",
    icon: "text-purple-600",
    accent: "text-purple-600",
  },
  pink: {
    iconBg: "bg-pink-100",
    icon: "text-pink-600",
    accent: "text-pink-600",
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
}) {
  const colors = colorClasses[color];

  return (
    <Card className="relative overflow-hidden border rounded-lg bg-white gap-2">
      <CardHeader className="px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            {title}
          </CardTitle>

          <div className={`p-2 rounded-md ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <p className="text-2xl font-bold text-slate-900">
          {value}
        </p>

        {trend && (
          <p className={`text-sm font-medium mt-1 ${colors.accent}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
