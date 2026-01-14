import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  UserPlus,
  Calendar,
  X,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { WithPagination } from "./with-pagination";
import { PaginationProps } from "./pagination";
interface RecentActivityProps {
  logs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    createdAt: Date;
    user: {
      name: string | null;
      email: string;
    };
  }>;
  pagination?: PaginationProps;
  title?: string;
}
const actionConfig: Record<
  string,
  { text: string; icon: React.ComponentType<any>; color: string }
> = {
  CREATE: { text: "creó", icon: Plus, color: "text-green-600" },
  UPDATE: { text: "actualizó", icon: Edit, color: "text-blue-600" },
  DELETE: { text: "eliminó", icon: Trash2, color: "text-red-600" },
  LOGIN: { text: "inició sesión", icon: LogIn, color: "text-gray-500" },
  LOGOUT: { text: "cerró sesión", icon: LogOut, color: "text-gray-500" },
  REGISTER: { text: "se registró", icon: UserPlus, color: "text-blue-600" },
  RESERVE: { text: "reservó", icon: Calendar, color: "text-orange-600" },
  CANCEL: { text: "canceló", icon: X, color: "text-red-600" },
  SOLD: { text: "vendió", icon: DollarSign, color: "text-green-600" },
  RESTORE: { text: "restauró", icon: RefreshCw, color: "text-blue-600" },
  SEED_EXECUTED: { text: "ejecutó", icon: Plus, color: "text-purple-600" },
};
const entityMap: Record<string, string> = {
  Car: "un vehículo",
  User: "un usuario",
  Brand: "una marca",
  Model: "un modelo",
  Payment: "un pago",
  Reservation: "una reserva",
  Session: "una sesión",
  Account: "una cuenta",
  System: "el sistema",
};
const specialCases: Record<string, (action: string, entity: string) => string> =
  {
    LOGIN: () => "",
    LOGOUT: () => "",
    REGISTER: () => "",
  };
const defaultActionConfig = {
  text: "realizó una acción en",
  icon: Edit,
  color: "text-gray-600",
};
export function RecentActivity({
  logs,
  pagination,
  title = "Actividad Reciente",
}: RecentActivityProps) {
  const getActivityText = (action: string, entity: string) => {
    if (specialCases[action]) {
      return specialCases[action](action, entity);
    }
    const actionData = actionConfig[action] || defaultActionConfig;
    const entityText = entityMap[entity] || entity.toLowerCase();
    return `${actionData.text} ${entityText}`;
  };
  const getActionConfig = (action: string) => {
    return actionConfig[action] || defaultActionConfig;
  };
  const activityContent = (
    <Card className="h-full py-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No hay actividad reciente
            </p>
          ) : (
            logs.map((log) => {
              const action = getActionConfig(log.action);
              const IconComponent = action.icon;
              const activityText = getActivityText(log.action, log.entity);
              return (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 ${action.color}`}>
                    <IconComponent className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      <span className="text-foreground">
                        {log.user.name || log.user.email}
                      </span>
                      {activityText && (
                        <span className="text-muted-foreground">
                          {" "}
                          {activityText}
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(log.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
  return pagination ? (
    <WithPagination
      pagination={pagination}
      containerClassName="flex flex-col min-h-[600px]"
      contentClassName="flex-1"
    >
      {activityContent}
    </WithPagination>
  ) : (
    activityContent
  );
}
