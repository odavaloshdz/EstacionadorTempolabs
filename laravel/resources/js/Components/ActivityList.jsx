import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function ActivityList({ activities = [] }) {
    return (
        <div className="overflow-y-auto max-h-[calc(100vh-500px)]">
            <ul className="divide-y divide-gray-100">
                {activities.map((activity) => (
                    <li key={activity.id} className="py-2">
                        <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 rounded-full p-1 ${
                                activity.action === "Ingreso" ? "bg-green-100" : "bg-red-100"
                            }`}>
                                {activity.action === "Ingreso" ? (
                                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                ) : (
                                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                    {activity.plate}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                    {activity.action} - {activity.location}
                                </p>
                            </div>
                            <div className="flex-shrink-0 whitespace-nowrap text-xs text-gray-500">
                                {activity.time}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            
            {activities.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500">
                    No hay actividad reciente
                </div>
            )}
        </div>
    );
} 