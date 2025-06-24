import React from "react";
import { Bell, Settings, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdownmenu";

export const Header: React.FC = () => {
  const { user, organization, logout } = useAuth();

  return (
    <header className="bg-ivory-50 border-b border-sage-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-hunter-700" />
            <div>
              <h1 className="text-xl font-bold text-hunter-900">
                QualityChain
              </h1>
              <p className="text-sm text-sage-700">{organization?.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-sage-700 hover:text-hunter-800 hover:bg-sage-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <button className="p-2 text-sage-700 hover:text-hunter-800 hover:bg-sage-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar className="h-[25px] w-[25px] border border-blue-600 bg-blue-600/10 text-xl uppercase">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={8} className="w-48">
              <DropdownMenuLabel className="text-center">
                {user?.name ?? "Guest"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
