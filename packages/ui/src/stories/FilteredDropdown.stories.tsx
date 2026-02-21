// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  FilteredDropdown,
  FilteredDropdownItem,
  type FilteredDropdownTab,
} from "../components/ui/filtered-dropdown";
import { Badge } from "../components/ui/badge";
import { Plane, MapPin, User, Star, Building2, Clock, AlertTriangle } from "lucide-react";

// ============================================================================
// Aviation Domain Data
// ============================================================================

const AIRCRAFT_DATA = [
  { id: "c172", model: "Cessna 172 Skyhawk", category: "Single Engine", status: "active" },
  { id: "c182", model: "Cessna 182 Skylane", category: "Single Engine", status: "active" },
  { id: "pa28", model: "Piper PA-28 Cherokee", category: "Single Engine", status: "maintenance" },
  { id: "sr22", model: "Cirrus SR22", category: "Single Engine", status: "active" },
  { id: "be36", model: "Beechcraft Bonanza", category: "Single Engine", status: "active" },
  { id: "da40", model: "Diamond DA40", category: "Single Engine", status: "active" },
  { id: "be58", model: "Beechcraft Baron", category: "Multi Engine", status: "active" },
  { id: "pa44", model: "Piper Seminole", category: "Multi Engine", status: "maintenance" },
  { id: "c310", model: "Cessna 310", category: "Multi Engine", status: "active" },
  { id: "pc12", model: "Pilatus PC-12", category: "Turboprop", status: "active" },
  { id: "tbm", model: "TBM 940", category: "Turboprop", status: "active" },
  { id: "kair", model: "King Air 350", category: "Turboprop", status: "active" },
];

const AIRPORT_DATA = [
  { id: "kjfk", code: "KJFK", name: "John F. Kennedy International", city: "New York", type: "International" },
  { id: "klax", code: "KLAX", name: "Los Angeles International", city: "Los Angeles", type: "International" },
  { id: "kord", code: "KORD", name: "O'Hare International", city: "Chicago", type: "International" },
  { id: "katl", code: "KATL", name: "Hartsfield-Jackson Atlanta", city: "Atlanta", type: "International" },
  { id: "ksfo", code: "KSFO", name: "San Francisco International", city: "San Francisco", type: "International" },
  { id: "kvny", code: "KVNY", name: "Van Nuys", city: "Van Nuys", type: "General Aviation" },
  { id: "khwd", code: "KHWD", name: "Hayward Executive", city: "Hayward", type: "General Aviation" },
  { id: "kpao", code: "KPAO", name: "Palo Alto", city: "Palo Alto", type: "General Aviation" },
  { id: "ksmq", code: "KSMQ", name: "Somerset", city: "Somerset", type: "General Aviation" },
  { id: "kcdw", code: "KCDW", name: "Essex County", city: "Caldwell", type: "General Aviation" },
];

const PILOT_DATA = [
  { id: "p1", name: "Sarah Mitchell", cert: "ATP", hours: 5200, rating: "CFI-I" },
  { id: "p2", name: "James Rodriguez", cert: "Commercial", hours: 1850, rating: "CFI" },
  { id: "p3", name: "Emily Chen", cert: "Private", hours: 320, rating: "IR" },
  { id: "p4", name: "Michael Brown", cert: "ATP", hours: 12000, rating: "MEI" },
  { id: "p5", name: "Amanda Torres", cert: "Commercial", hours: 890, rating: "CFI-I" },
  { id: "p6", name: "David Kim", cert: "Private", hours: 180, rating: "Student" },
  { id: "p7", name: "Rachel Foster", cert: "ATP", hours: 8500, rating: "DPE" },
  { id: "p8", name: "William Hayes", cert: "Commercial", hours: 2100, rating: "CFI" },
];

const FBO_DATA = [
  { id: "fbo1", name: "Atlantic Aviation", airport: "KJFK", services: "Full Service" },
  { id: "fbo2", name: "Signature Flight Support", airport: "KLAX", services: "Full Service" },
  { id: "fbo3", name: "Million Air", airport: "KORD", services: "Full Service" },
  { id: "fbo4", name: "Jet Aviation", airport: "KVNY", services: "Full Service" },
  { id: "fbo5", name: "TAC Air", airport: "KSMQ", services: "Limited" },
];

// ============================================================================
// Stateful Story Components
// ============================================================================

function DefaultStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
    { id: "recent", label: "Recent", icon: <Clock className="w-3 h-3" /> },
  ];

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Select Aircraft"
      triggerIcon={<Plane className="w-3.5 h-3.5" />}
      searchPlaceholder="Filter aircraft..."
    >
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-primary" />}
        label="Cessna 172"
        description="N12345 - Single Engine"
        onClick={() => console.log("Selected C172")}
      />
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-primary" />}
        label="Piper Cherokee"
        description="N67890 - Single Engine"
        onClick={() => console.log("Selected Cherokee")}
      />
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-primary" />}
        label="Cirrus SR22"
        description="N11111 - Single Engine"
        onClick={() => console.log("Selected SR22")}
      />
    </FilteredDropdown>
  );
}

function AircraftSelectionStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
    { id: "single", label: "Single" },
    { id: "multi", label: "Multi" },
    { id: "turbo", label: "Turboprop" },
  ];

  const filteredAircraft = AIRCRAFT_DATA.filter((aircraft) => {
    const matchesSearch = aircraft.model.toLowerCase().includes(searchValue.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "single" && aircraft.category === "Single Engine") ||
      (activeTab === "multi" && aircraft.category === "Multi Engine") ||
      (activeTab === "turbo" && aircraft.category === "Turboprop");
    return matchesSearch && matchesTab;
  });

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel={selectedId ? AIRCRAFT_DATA.find(a => a.id === selectedId)?.model || "Select Aircraft" : "Select Aircraft"}
      triggerIcon={<Plane className="w-3.5 h-3.5" />}
      searchPlaceholder="Search aircraft models..."
      viewAllHref="/aircraft"
      viewAllLabel="View All Aircraft"
      onAddClick={() => console.log("Add new aircraft")}
      addLabel="New Aircraft"
      emptyState={
        <div className="py-8 text-center text-sm text-muted-foreground">
          No aircraft found matching your search.
        </div>
      }
    >
      {filteredAircraft.map((aircraft) => (
        <FilteredDropdownItem
          key={aircraft.id}
          icon={<Plane className="w-4 h-4 text-primary" />}
          label={aircraft.model}
          description={aircraft.category}
          selected={selectedId === aircraft.id}
          onClick={() => setSelectedId(aircraft.id)}
          badge={
            aircraft.status === "maintenance" ? (
              <Badge variant="warning">MAINT</Badge>
            ) : (
              <Badge variant="success">ACTIVE</Badge>
            )
          }
        />
      ))}
    </FilteredDropdown>
  );
}

function AirportSelectionStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All", icon: <MapPin className="w-3 h-3" /> },
    { id: "intl", label: "International" },
    { id: "ga", label: "GA" },
  ];

  const filteredAirports = AIRPORT_DATA.filter((airport) => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      airport.code.toLowerCase().includes(searchLower) ||
      airport.name.toLowerCase().includes(searchLower) ||
      airport.city.toLowerCase().includes(searchLower);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "intl" && airport.type === "International") ||
      (activeTab === "ga" && airport.type === "General Aviation");
    return matchesSearch && matchesTab;
  });

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel={selectedCode || "Departure Airport"}
      triggerIcon={<MapPin className="w-3.5 h-3.5" />}
      searchPlaceholder="Search by ICAO, name, or city..."
      panelClassName="min-w-[320px]"
      emptyState={
        <div className="py-8 text-center text-sm text-muted-foreground">
          No airports found.
        </div>
      }
    >
      {filteredAirports.map((airport) => (
        <FilteredDropdownItem
          key={airport.id}
          icon={<MapPin className="w-4 h-4 text-primary" />}
          label={airport.code}
          description={`${airport.name} - ${airport.city}`}
          selected={selectedCode === airport.code}
          onClick={() => setSelectedCode(airport.code)}
          badge={
            <span className="text-[10px] text-muted-foreground">
              {airport.type === "International" ? "INTL" : "GA"}
            </span>
          }
        />
      ))}
    </FilteredDropdown>
  );
}

function PilotSelectionStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All Pilots" },
    { id: "cfi", label: "Instructors" },
    { id: "atp", label: "ATP" },
  ];

  const filteredPilots = PILOT_DATA.filter((pilot) => {
    const matchesSearch = pilot.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "cfi" && pilot.rating.includes("CFI")) ||
      (activeTab === "atp" && pilot.cert === "ATP");
    return matchesSearch && matchesTab;
  });

  return (
    <FilteredDropdown
      variant="overlay"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel={selectedId ? PILOT_DATA.find(p => p.id === selectedId)?.name || "Assign Pilot" : "Assign Pilot"}
      triggerIcon={<User className="w-3.5 h-3.5" />}
      searchPlaceholder="Search pilots by name..."
      viewAllHref="/pilots"
      viewAllLabel="Pilot Directory"
      onAddClick={() => console.log("Add pilot")}
      addLabel="Add Pilot"
      emptyState={
        <div className="py-8 text-center text-sm text-muted-foreground">
          No pilots match your criteria.
        </div>
      }
    >
      {filteredPilots.map((pilot) => (
        <FilteredDropdownItem
          key={pilot.id}
          icon={<User className="w-4 h-4 text-primary" />}
          label={pilot.name}
          description={`${pilot.cert} - ${pilot.hours.toLocaleString()} hrs - ${pilot.rating}`}
          selected={selectedId === pilot.id}
          onClick={() => setSelectedId(pilot.id)}
          action={
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Favorite", pilot.id);
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-muted-foreground hover:text-yellow-400" />
            </button>
          }
        />
      ))}
    </FilteredDropdown>
  );
}

function OverlayVariantStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("fbo");

  const tabs: FilteredDropdownTab[] = [
    { id: "fbo", label: "FBO", icon: <Building2 className="w-3 h-3" /> },
    { id: "services", label: "Services" },
  ];

  return (
    <FilteredDropdown
      variant="overlay"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Select FBO"
      triggerIcon={<Building2 className="w-3.5 h-3.5" />}
      searchPlaceholder="Search FBOs..."
      panelClassName="min-w-[400px]"
    >
      {FBO_DATA.map((fbo) => (
        <FilteredDropdownItem
          key={fbo.id}
          icon={<Building2 className="w-4 h-4 text-primary" />}
          label={fbo.name}
          description={`${fbo.airport} - ${fbo.services}`}
          onClick={() => console.log("Selected", fbo.name)}
        />
      ))}
    </FilteredDropdown>
  );
}

function WithHeaderExtraStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
  ];

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Flight Status"
      triggerIcon={<Plane className="w-3.5 h-3.5" />}
      searchPlaceholder="Filter flights..."
      headerExtra={
        <Badge variant="success">3 ACTIVE</Badge>
      }
    >
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-green-400" />}
        label="N12345"
        description="KJFK -> KLAX"
        badge={<Badge variant="success">EN ROUTE</Badge>}
      />
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-yellow-400" />}
        label="N67890"
        description="KORD -> KATL"
        badge={<Badge variant="warning">DELAYED</Badge>}
      />
      <FilteredDropdownItem
        icon={<Plane className="w-4 h-4 text-green-400" />}
        label="N11111"
        description="KSFO -> KLAX"
        badge={<Badge variant="success">TAXIING</Badge>}
      />
    </FilteredDropdown>
  );
}

function NoSearchInputStory() {
  const [activeTab, setActiveTab] = React.useState("status");

  const tabs: FilteredDropdownTab[] = [
    { id: "status", label: "Status" },
    { id: "alerts", label: "Alerts", icon: <AlertTriangle className="w-3 h-3" /> },
  ];

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue=""
      onSearchChange={() => {}}
      showSearch={false}
      triggerLabel="Quick Actions"
      triggerIcon={<AlertTriangle className="w-3.5 h-3.5" />}
    >
      <FilteredDropdownItem
        icon={<div className="w-2 h-2 rounded-full bg-green-500" />}
        label="System Online"
        description="All systems operational"
      />
      <FilteredDropdownItem
        icon={<div className="w-2 h-2 rounded-full bg-yellow-500" />}
        label="Weather Advisory"
        description="IFR conditions at destination"
      />
      <FilteredDropdownItem
        icon={<div className="w-2 h-2 rounded-full bg-red-500" />}
        label="NOTAM Alert"
        description="Runway 27L closed"
      />
    </FilteredDropdown>
  );
}

function LoadingStateStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
  ];

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Loading Aircraft"
      triggerIcon={<Plane className="w-3.5 h-3.5" />}
      isLoading={true}
    >
      <FilteredDropdownItem label="Item 1" />
    </FilteredDropdown>
  );
}

function EmptyStateStory() {
  const [searchValue, setSearchValue] = React.useState("xyz123");
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
  ];

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Select Aircraft"
      triggerIcon={<Plane className="w-3.5 h-3.5" />}
      searchPlaceholder="Search..."
      emptyState={
        <div className="py-12 text-center">
          <Plane className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">No aircraft found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      }
      onAddClick={() => console.log("Add aircraft")}
      addLabel="Add New"
    >
      {null}
    </FilteredDropdown>
  );
}

function ControlledOpenStory() {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded"
        >
          OPEN DROPDOWN
        </button>
        <button
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 text-xs bg-muted text-foreground rounded"
        >
          CLOSE DROPDOWN
        </button>
      </div>
      <FilteredDropdown
        variant="dropdown"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        triggerLabel="Controlled"
        triggerIcon={<Plane className="w-3.5 h-3.5" />}
        open={open}
        onOpenChange={setOpen}
      >
        <FilteredDropdownItem
          label="Controlled Item 1"
          description="Click external buttons to control"
        />
        <FilteredDropdownItem
          label="Controlled Item 2"
          description="Open state managed externally"
        />
      </FilteredDropdown>
    </div>
  );
}

function LargeDatasetStory() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  // Generate large dataset of airports
  const largeAirportData = [
    ...AIRPORT_DATA,
    { id: "kden", code: "KDEN", name: "Denver International", city: "Denver", type: "International" },
    { id: "klas", code: "KLAS", name: "Harry Reid International", city: "Las Vegas", type: "International" },
    { id: "kphx", code: "KPHX", name: "Phoenix Sky Harbor", city: "Phoenix", type: "International" },
    { id: "kmia", code: "KMIA", name: "Miami International", city: "Miami", type: "International" },
    { id: "kbos", code: "KBOS", name: "Logan International", city: "Boston", type: "International" },
    { id: "ksea", code: "KSEA", name: "Seattle-Tacoma International", city: "Seattle", type: "International" },
    { id: "kmsp", code: "KMSP", name: "Minneapolis-Saint Paul", city: "Minneapolis", type: "International" },
    { id: "kdtw", code: "KDTW", name: "Detroit Metropolitan", city: "Detroit", type: "International" },
    { id: "kewr", code: "KEWR", name: "Newark Liberty", city: "Newark", type: "International" },
    { id: "klga", code: "KLGA", name: "LaGuardia", city: "New York", type: "International" },
    { id: "kdca", code: "KDCA", name: "Reagan National", city: "Washington", type: "International" },
    { id: "kiad", code: "KIAD", name: "Dulles International", city: "Washington", type: "International" },
    { id: "kfll", code: "KFLL", name: "Fort Lauderdale-Hollywood", city: "Fort Lauderdale", type: "International" },
    { id: "kmco", code: "KMCO", name: "Orlando International", city: "Orlando", type: "International" },
    { id: "ksan", code: "KSAN", name: "San Diego International", city: "San Diego", type: "International" },
  ];

  const tabs: FilteredDropdownTab[] = [
    { id: "all", label: "All", icon: <MapPin className="w-3 h-3" /> },
    { id: "intl", label: "International" },
    { id: "ga", label: "GA" },
  ];

  const filteredAirports = largeAirportData.filter((airport) => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch =
      airport.code.toLowerCase().includes(searchLower) ||
      airport.name.toLowerCase().includes(searchLower) ||
      airport.city.toLowerCase().includes(searchLower);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "intl" && airport.type === "International") ||
      (activeTab === "ga" && airport.type === "General Aviation");
    return matchesSearch && matchesTab;
  });

  return (
    <FilteredDropdown
      variant="dropdown"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      triggerLabel="Browse Airports"
      triggerIcon={<MapPin className="w-3.5 h-3.5" />}
      searchPlaceholder="Search 25 airports..."
      panelClassName="min-w-[360px] max-h-[350px]"
      viewAllHref="/airports"
      viewAllLabel="Full Airport Database"
      emptyState={
        <div className="py-8 text-center text-sm text-muted-foreground">
          No airports match &quot;{searchValue}&quot;
        </div>
      }
    >
      {filteredAirports.map((airport) => (
        <FilteredDropdownItem
          key={airport.id}
          icon={<MapPin className="w-4 h-4 text-primary" />}
          label={airport.code}
          description={`${airport.name} - ${airport.city}`}
          badge={
            <span className="text-[10px] text-muted-foreground font-mono">
              {airport.type === "International" ? "INTL" : "GA"}
            </span>
          }
        />
      ))}
    </FilteredDropdown>
  );
}

function AllVariantsStory() {
  const [dropdownSearch, setDropdownSearch] = React.useState("");
  const [dropdownTab, setDropdownTab] = React.useState("all");
  const [overlaySearch, setOverlaySearch] = React.useState("");
  const [overlayTab, setOverlayTab] = React.useState("all");
  const [aircraftSearch, setAircraftSearch] = React.useState("");
  const [aircraftTab, setAircraftTab] = React.useState("all");
  const [airportSearch, setAirportSearch] = React.useState("");
  const [airportTab, setAirportTab] = React.useState("all");
  const [pilotSearch, setPilotSearch] = React.useState("");
  const [pilotTab, setPilotTab] = React.useState("all");
  const [normalSearch, setNormalSearch] = React.useState("");
  const [normalTab, setNormalTab] = React.useState("all");
  const [loadingSearch, setLoadingSearch] = React.useState("");
  const [loadingTab, setLoadingTab] = React.useState("all");

  const simpleTabs: FilteredDropdownTab[] = [{ id: "all", label: "All" }];

  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">VARIANTS</h3>
        <div className="flex flex-wrap gap-4">
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={dropdownTab}
            onTabChange={setDropdownTab}
            searchValue={dropdownSearch}
            onSearchChange={setDropdownSearch}
            triggerLabel="Dropdown"
          >
            <FilteredDropdownItem label="Item One" description="First item" />
            <FilteredDropdownItem label="Item Two" description="Second item" />
            <FilteredDropdownItem label="Item Three" description="Third item" />
          </FilteredDropdown>
          <FilteredDropdown
            variant="overlay"
            tabs={simpleTabs}
            activeTab={overlayTab}
            onTabChange={setOverlayTab}
            searchValue={overlaySearch}
            onSearchChange={setOverlaySearch}
            triggerLabel="Overlay"
          >
            <FilteredDropdownItem label="Item One" description="First item" />
            <FilteredDropdownItem label="Item Two" description="Second item" />
            <FilteredDropdownItem label="Item Three" description="Third item" />
          </FilteredDropdown>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">AVIATION USE CASES</h3>
        <div className="flex flex-wrap gap-4">
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={aircraftTab}
            onTabChange={setAircraftTab}
            searchValue={aircraftSearch}
            onSearchChange={setAircraftSearch}
            triggerLabel="Aircraft"
            triggerIcon={<Plane className="w-3.5 h-3.5" />}
          >
            <FilteredDropdownItem
              icon={<Plane className="w-4 h-4 text-primary" />}
              label="N12345"
              description="Cessna 172"
            />
          </FilteredDropdown>
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={airportTab}
            onTabChange={setAirportTab}
            searchValue={airportSearch}
            onSearchChange={setAirportSearch}
            triggerLabel="Airport"
            triggerIcon={<MapPin className="w-3.5 h-3.5" />}
          >
            <FilteredDropdownItem
              icon={<MapPin className="w-4 h-4 text-primary" />}
              label="KJFK"
              description="New York"
            />
          </FilteredDropdown>
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={pilotTab}
            onTabChange={setPilotTab}
            searchValue={pilotSearch}
            onSearchChange={setPilotSearch}
            triggerLabel="Pilot"
            triggerIcon={<User className="w-3.5 h-3.5" />}
          >
            <FilteredDropdownItem
              icon={<User className="w-4 h-4 text-primary" />}
              label="John Smith"
              description="ATP - CFI-I"
            />
          </FilteredDropdown>
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg text-foreground mb-4">STATES</h3>
        <div className="flex flex-wrap gap-4">
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={normalTab}
            onTabChange={setNormalTab}
            searchValue={normalSearch}
            onSearchChange={setNormalSearch}
            triggerLabel="Normal"
          >
            <FilteredDropdownItem label="Item One" description="First item" />
            <FilteredDropdownItem label="Item Two" description="Second item" />
            <FilteredDropdownItem label="Item Three" description="Third item" />
          </FilteredDropdown>
          <FilteredDropdown
            variant="dropdown"
            tabs={simpleTabs}
            activeTab={loadingTab}
            onTabChange={setLoadingTab}
            searchValue={loadingSearch}
            onSearchChange={setLoadingSearch}
            triggerLabel="Loading..."
            isLoading={true}
          >
            <FilteredDropdownItem label="Item One" description="First item" />
            <FilteredDropdownItem label="Item Two" description="Second item" />
            <FilteredDropdownItem label="Item Three" description="Third item" />
          </FilteredDropdown>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Meta Configuration
// ============================================================================

/**
 * FilteredDropdown component with SKYNET tactical styling.
 * A versatile dropdown with tabbed navigation, search filtering, and action buttons.
 * Ideal for selecting aircraft, airports, pilots, and other aviation entities.
 */
const meta: Meta<typeof FilteredDropdown> = {
  title: "Components/FilteredDropdown",
  component: FilteredDropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A filterable dropdown component with tabbed navigation, search input, and action footer. Features SKYNET cyberpunk styling with support for both dropdown and overlay variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["dropdown", "overlay"],
      description: "Presentation variant - dropdown positions below trigger, overlay centers on screen",
    },
    triggerLabel: {
      control: "text",
      description: "Label displayed on the trigger button",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    showSearch: {
      control: "boolean",
      description: "Whether to show the search input",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state for the trigger button",
    },
    viewAllLabel: {
      control: "text",
      description: "Label for the View All action link",
    },
    addLabel: {
      control: "text",
      description: "Label for the Add action button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  render: () => <DefaultStory />,
};

export const AircraftSelection: Story = {
  render: () => <AircraftSelectionStory />,
};

export const AirportSelection: Story = {
  render: () => <AirportSelectionStory />,
};

export const PilotSelection: Story = {
  render: () => <PilotSelectionStory />,
};

export const OverlayVariant: Story = {
  render: () => <OverlayVariantStory />,
};

export const WithHeaderExtra: Story = {
  render: () => <WithHeaderExtraStory />,
};

export const NoSearchInput: Story = {
  render: () => <NoSearchInputStory />,
};

export const LoadingState: Story = {
  render: () => <LoadingStateStory />,
};

export const EmptyState: Story = {
  render: () => <EmptyStateStory />,
};

export const ControlledOpen: Story = {
  render: () => <ControlledOpenStory />,
};

export const LargeDataset: Story = {
  render: () => <LargeDatasetStory />,
};

export const AllVariants: Story = {
  render: () => <AllVariantsStory />,
  parameters: {
    layout: "padded",
  },
};
