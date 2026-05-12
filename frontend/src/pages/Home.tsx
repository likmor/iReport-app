import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Stack,
  Text,
  Badge,
  ScrollArea,
  Select,
  MultiSelect,
  Card,
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { point } from "leaflet";
import { ReportModal } from "@/components/ReportModal";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const KRAKOW: [number, number] = [50.0647, 19.945];

const STATUS_COLORS: Record<string, string> = {
  New: "blue",
  InProgress: "yellow",
  Resolved: "green",
  Rejected: "red",
};

const CATEGORIES = ["Road", "Lighting", "Garbage", "Vandalism", "Other"];

const MOCK_REPORTS = [
  {
    id: 1,
    title: "Pothole on Floriańska",
    category: "Road",
    status: "New",
    lat: 50.0647,
    lng: 19.945,
    description: "Large pothole causing damage to vehicles.",
  },
  {
    id: 2,
    title: "Broken streetlight",
    category: "Lighting",
    status: "InProgress",
    lat: 50.062,
    lng: 19.94,
    description: "Streetlight has been out for 2 weeks.",
  },
  {
    id: 3,
    title: "Illegal dumping",
    category: "Garbage",
    status: "Resolved",
    lat: 50.067,
    lng: 19.95,
    description: "Garbage left near the park entrance.",
  },
  {
    id: 4,
    title: "Graffiti on wall",
    category: "Vandalism",
    status: "Rejected",
    lat: 50.063,
    lng: 19.948,
    description: "Spray paint on public building.",
  },
  {
    id: 5,
    title: "Road crack",
    category: "Road",
    status: "New",
    lat: 50.066,
    lng: 19.942,
    description: "Crack running across the bike lane.",
  },
];

const MapFlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 0.3 });
  }, [position, map]);
  return null;
};

const SidebarContent = ({
  filtered,
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  onReportClick,
  selectedId,
}: {
  filtered: typeof MOCK_REPORTS;
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedStatus: string | null;
  setSelectedStatus: (v: string | null) => void;
  onReportClick: (report: (typeof MOCK_REPORTS)[0]) => void;
  selectedId: number | null;
}) => (
  <Stack h="100%" gap={0}>
    <Stack p="md" gap="sm">
      <Text fw={700} size="sm">
        Filters
      </Text>
      <MultiSelect
        label="Category"
        placeholder="All categories"
        data={CATEGORIES}
        value={selectedCategories}
        onChange={setSelectedCategories}
        clearable
      />
      <Select
        label="Status"
        placeholder="All statuses"
        data={["New", "InProgress", "Resolved", "Rejected"]}
        value={selectedStatus}
        onChange={setSelectedStatus}
        clearable
      />
      <Text size="xs" c="dimmed">
        {filtered.length} report{filtered.length !== 1 ? "s" : ""} found
      </Text>
    </Stack>

    <Divider />

    <ScrollArea flex={1} p="md">
      <Stack gap="sm">
        {filtered.length === 0 && (
          <Text size="sm" c="dimmed" ta="center" mt="xl">
            No reports match your filters
          </Text>
        )}
        {filtered.map((report) => (
          <Card
            key={report.id}
            withBorder
            padding="sm"
            radius="md"
            onClick={() => onReportClick(report)}
            style={{ cursor: "pointer" }}
          >
            <Group justify="space-between" mb={4}>
              <Text size="sm" fw={600} lineClamp={1}>
                {report.title}
              </Text>
              <Badge color={STATUS_COLORS[report.status]} size="xs" variant="light">
                {report.status}
              </Badge>
            </Group>
            <Group gap={4} mb={4}>
              <ActionIcon size={12} color="gray" />
              <Text size="xs" c="dimmed">
                {report.category}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" lineClamp={2}>
              {report.description}
            </Text>
          </Card>
        ))}
      </Stack>
    </ScrollArea>
  </Stack>
);

export const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState<(typeof MOCK_REPORTS)[0] | null>(null);

  const filtered = MOCK_REPORTS.filter((r) => {
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(r.category);
    const matchStatus = !selectedStatus || r.status === selectedStatus;
    return matchCategory && matchStatus;
  });

  const handleReportClick = (report: (typeof MOCK_REPORTS)[0], flyTo = true) => {
    setSelectedReport(report);
    setSelectedId(report.id);
    if (flyTo) {
      setFlyTo([report.lat, report.lng]);
      setTimeout(() => openModal(), 400);
    } else {
      openModal();
    }
    close();
  };

  const sidebarProps = {
    filtered,
    selectedCategories,
    setSelectedCategories,
    selectedStatus,
    setSelectedStatus,
    onReportClick: handleReportClick,
    selectedId,
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", position: "relative" }}>
      <Box
        w={320}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        visibleFrom="sm"
      >
        <SidebarContent {...sidebarProps} />
      </Box>

      <Box hiddenFrom="sm" style={{ position: "absolute", top: 12, left: 60, zIndex: 2000 }}>
        <ActionIcon
          onClick={open}
          variant="gradient"
        >
          <MagnifyingGlassIcon  style={{ width: "70%", height: "70%" }} />
        </ActionIcon>
      </Box>

      <Drawer
        opened={opened}
        onClose={close}
        title="Reports"
        hiddenFrom="sm"
        zIndex={1000}
        padding={0}
      >
        <SidebarContent {...sidebarProps} />
      </Drawer>

      <Box flex={1}>
        <MapContainer
          center={KRAKOW}
          zoom={14}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFlyTo position={flyTo} />
          {filtered.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              eventHandlers={{
                click: () => {
                  handleReportClick(report, false);
                },
              }}
            >
              {/* <Popup>
                <Text fw={600} size="sm">
                  {report.title}
                </Text>
                <Badge color={STATUS_COLORS[report.status]} size="xs" variant="light" mt={4}>
                  {report.status}
                </Badge>
                <Text size="xs" mt={4}>
                  {report.description}
                </Text>
              </Popup> */}
            </Marker>
          ))}
        </MapContainer>
      </Box>
      <ReportModal report={selectedReport} opened={modalOpened} onClose={closeModal} />
    </div>
  );
};
