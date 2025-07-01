import React from "react";
import { Card, CardBody } from "@heroui/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradient,
  textColor,
  iconColor,
}) => {
  return (
    <Card className={`bg-gradient-to-r ${gradient}`}>
      <CardBody className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${textColor}`}>{title}</p>
            <p
              className={`text-lg sm:text-xl font-bold ${textColor.replace("600", "900").replace("300", "100")}`}
            >
              {value}
            </p>
          </div>
          <div className={iconColor}>{icon}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
