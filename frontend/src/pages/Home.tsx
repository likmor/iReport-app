import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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
  Drawer,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { ReportModal } from "@/components/ReportModal";
import { FunnelIcon, PlusIcon } from "@phosphor-icons/react";
import { CreateReportModal } from "@/components/CreateReportModal";
import { CategoryIcon } from "@/utils/categoryIcons";
import { useReports } from "@/services/reportService";
import type { Category, Report } from "@/types/report";
import { useCategories } from "@/services/categoryService";
import { STATUS_COLORS } from "@/utils/statusIcons";
import { createCategoryMarkerIcon } from "@/utils/markerIcon";

const KRAKOW: [number, number] = [50.0647, 19.945];


const MapFlyTo = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 0.3 });
  }, [position, map]);
  return null;
};

const SidebarContent = ({
  filtered,
  categories,
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  onReportClick,
  onCreateClick,
  selectedId,
}: {
  filtered: Report[];
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedStatus: string | null;
  setSelectedStatus: (v: string | null) => void;
  onReportClick: (report: Report) => void;
  onCreateClick: () => void;
  selectedId: number | null;
}) => (
  <Stack h="100%" gap={0}>
    <Stack p="md" gap="sm">
      <Button
        leftSection={<PlusIcon size={16} />}
        color="lime"
        c="dark"
        fullWidth
        onClick={onCreateClick}
      >
        Report a Problem
      </Button>
      <Text fw={700} size="sm">
        Filters
      </Text>
      <MultiSelect
        label="Category"
        placeholder="All categories"
        data={categories.map((el) => el.name)}
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
            style={{ cursor: "pointer",boxShadow: "0 1px 6px rgba(0,0,0,0.2)" }}
          >
            <Group justify="space-between" mb={4}>
              <Text size="sm" fw={600} lineClamp={1} style={{ flex: 1, minWidth: 0 }}>
                {report.title}
              </Text>
              <Badge color={STATUS_COLORS[report.status]} size="xs" variant="outline" style={{flexShrink: 0}}>
                {report.status}
              </Badge>
            </Group>
            <Group gap={4} mb={4}>
              <CategoryIcon name={report.category.icon} size={16}></CategoryIcon>
              <Text size="xs" c="dimmed">
                {report.category.name}
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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const { data: reports, isLoading: isReportsLoading } = useReports();

  const isLoading = isCategoriesLoading || isReportsLoading;

  const filtered =
    reports?.filter((r) => {
      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(r.category.name);
      const matchStatus = !selectedStatus || r.status === selectedStatus;
      return matchCategory && matchStatus;
    }) ?? [];

  const handleReportClick = (report: Report, flyTo = true) => {
    setSelectedReport(report);
    setSelectedId(report.id);
    if (flyTo) {
      setFlyTo([report.latitude, report.longitude]);
      setTimeout(() => openModal(), 400);
    } else {
      openModal();
    }
    close();
  };

  const sidebarProps = {
    filtered,
    categories: categories ?? [],
    selectedCategories,
    setSelectedCategories,
    selectedStatus,
    setSelectedStatus,
    onReportClick: handleReportClick,
    onCreateClick: openCreate,
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
        {isLoading ? (
          <Center h="calc(100vh - 60px)">
            <Loader color="lime" />
          </Center>
        ) : (
          <SidebarContent {...sidebarProps} />
        )}
      </Box>
      <Box style={{ position: "absolute", bottom: 24, right: 24, zIndex: 101 }} hiddenFrom="sm">
        <Button
          leftSection={<PlusIcon size={16} />}
          color="lime"
          c="dark"
          onClick={openCreate}
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
        >
          Report Problem
        </Button>
      </Box>
      <Box hiddenFrom="sm" style={{ position: "absolute", top: 12, left: 60, zIndex: 101 }}>
        <Button
          leftSection={<FunnelIcon size={18} />}
          color="lime"
          c="dark"
          onClick={open}
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
        >
          Filter
        </Button>
      </Box>

      <Drawer opened={opened} onClose={close} hiddenFrom="sm" title="Reports">
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
              position={[report.latitude, report.longitude]}
              icon={createCategoryMarkerIcon(report.category.icon, report.status)}
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
      <CreateReportModal opened={createOpened} onClose={closeCreate} />
    </div>
  );
};
