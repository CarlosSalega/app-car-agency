import { Car, CheckCircle, Clock, DollarSign, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  totalCars: number;
  availableCars: number;
  reservedCars: number;
  soldCars: number;
  totalVisits: number;
}

export function DashboardStats({ totalCars, availableCars, reservedCars, soldCars, totalVisits }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Vehículos",
      value: totalCars,
      icon: Car,
      description: "En el sistema",
    },
    {
      title: "Disponibles",
      value: availableCars,
      icon: CheckCircle,
      description: "Listos para vender",
    },
    {
      title: "Reservados",
      value: reservedCars,
      icon: Clock,
      description: "En proceso",
    },
    {
      title: "Vendidos",
      value: soldCars,
      icon: DollarSign,
      description: "Completados",
    },
    {
      title: "Visitas Totales",
      value: totalVisits,
      icon: Eye,
      description: "A detalle de autos",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="py-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
