"use client";


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  activeTab,
  onTabChange,
}: {
  items: {
    title: string;
    key: string;
    icon?: React.ElementType;
  }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.key}
            className={activeTab === item.key ? "bg-muted" : ""}
          >
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={activeTab === item.key ? "bg-muted" : ""}
            >
              <button
                onClick={() => onTabChange(item.key)}
                className="flex items-center gap-2 w-full text-left"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
