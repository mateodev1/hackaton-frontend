"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, Ship, AlertCircle, Settings, Menu, Clock, UserCircle, MoreHorizontal } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Component() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState("Last 24h")

  const quickStats = [
    { title: "Active Vessels", value: 125 },
    { title: "In Port", value: 30 },
    { title: "Delayed", value: 5 },
    { title: "Alerts Triggered", value: 12 },
  ]

  const vessels = [
    {
      name: "Ocean Explorer",
      mmsi: "235001234",
      status: "At Sea",
      position: "34.0522° N, 118.2437° W",
      lastUpdated: "2025-07-12 10:30 AM",
    },
    {
      name: "Sea Serpent",
      mmsi: "235005678",
      status: "In Port",
      position: "33.7701° N, 118.1937° W",
      lastUpdated: "2025-07-12 09:45 AM",
    },
    {
      name: "Harbor Master",
      mmsi: "235009012",
      status: "At Sea",
      position: "33.9500° N, 118.4000° W",
      lastUpdated: "2025-07-12 11:00 AM",
    },
    {
      name: "Coastal Guardian",
      mmsi: "235003456",
      status: "In Port",
      position: "34.0000° N, 118.2000° W",
      lastUpdated: "2025-07-12 08:15 AM",
    },
    {
      name: "Pacific Voyager",
      mmsi: "235007890",
      status: "At Sea",
      position: "34.1000° N, 118.3000° W",
      lastUpdated: "2025-07-12 10:00 AM",
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center gap-2 p-4">
          <Ship className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">FleetWatch</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="#">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Ship className="h-4 w-4" />
                      <span>My Fleet</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <AlertCircle className="h-4 w-4" />
                      <span>Alerts</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1 lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </SidebarTrigger>
          <h1 className="text-xl font-semibold">Fleet Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Clock className="h-4 w-4" />
                  <span>{selectedTimeRange}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Time Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSelectedTimeRange("Last 24h")}>Last 24h</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeRange("Last 7 days")}>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedTimeRange("Last 30 days")}>Last 30 days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <section aria-labelledby="quick-stats-heading">
            <h2 id="quick-stats-heading" className="sr-only">
              Quick Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Ship className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="vessel-map-heading" className="flex-1">
            <h2 id="vessel-map-heading" className="text-lg font-semibold mb-4">
              Vessel Locations Map
            </h2>
            <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-muted/50 md:h-96">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="Placeholder map showing vessel locations"
                layout="fill"
                objectFit="cover"
                className="opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Interactive Map Placeholder
              </div>
            </div>
          </section>

          <section aria-labelledby="tracked-vessels-heading">
            <h2 id="tracked-vessels-heading" className="text-lg font-semibold mb-4">
              Tracked Vessels
            </h2>
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vessel Name</TableHead>
                    <TableHead>MMSI</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Known Position</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vessels.map((vessel) => (
                    <TableRow key={vessel.mmsi}>
                      <TableCell className="font-medium">{vessel.name}</TableCell>
                      <TableCell>{vessel.mmsi}</TableCell>
                      <TableCell className="hidden md:table-cell">{vessel.status}</TableCell>
                      <TableCell className="hidden lg:table-cell">{vessel.position}</TableCell>
                      <TableCell className="hidden sm:table-cell">{vessel.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuItem>Send Command</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
