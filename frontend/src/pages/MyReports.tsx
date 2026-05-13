import {
  Text,
  ScrollArea,
  Badge,
  Card,
  Group,
  Stack,
  Title,
  Loader,
  Center,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useMyReports } from "../services/reportService";
import type { Report } from "../types/report";
import { useState } from "react";
import { ReportModal } from "../components/ReportModal";
import { CalendarIcon, EyeIcon, MapPinIcon, TagIcon } from "@phosphor-icons/react";
import { CategoryIcon } from "@/utils/categoryIcons";

const STATUS_COLORS: Record<string, string> = {
  New: "blue",
  InProgress: "yellow",
  Resolved: "green",
  Rejected: "red",
};

export default function MyReportsPage() {
  const { data: reports, isLoading, isError } = useMyReports();
  const [selected, setSelected] = useState<Report | null>(null);

  if (isLoading)
    return (
      <Center h="calc(100vh - 60px)">
        <Loader color="green" />
      </Center>
    );

  if (isError)
    return (
      <Center h="calc(100vh - 60px)">
        <Text c="dimmed">Failed to load reports.</Text>
      </Center>
    );

  return (
    <Stack p="xl" maw={800} mx="auto">
      <Group justify="space-between">
        <Title order={3}>My Reports</Title>
        <Text size="sm" c="dimmed">
          {reports?.length ?? 0} total
        </Text>
      </Group>

      <ScrollArea>
        <Stack gap="sm">
          {reports?.length === 0 && (
            <Text size="sm" c="dimmed" ta="center" mt="xl">
              You haven't submitted any reports yet.
            </Text>
          )}

          {reports?.map((report) => (
            <Card
              key={report.id}
              withBorder
              padding="md"
              radius="md"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(report)}
            >
              <Group justify="space-between" mb={6}>
                <Text size="sm" fw={600}>
                  {report.title}
                </Text>
                <Group gap="xs">
                  <Badge color={STATUS_COLORS[report.status]} size="xs" variant="light">
                    {report.status}
                  </Badge>
                  <Tooltip label="View details">
                    <ActionIcon variant="subtle" size="sm" color="gray">
                      <EyeIcon size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              <Group gap="lg">
                <Group gap={4}>
                  <CategoryIcon size={12} name={report.category.icon} />
                  <Text size="xs" c="dimmed">
                    {report.category.name}
                  </Text>
                </Group>
                <Group gap={4}>
                  <MapPinIcon size={12} color="gray" />
                  <Text size="xs" c="dimmed">
                    {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                  </Text>
                </Group>
                <Group gap={4}>
                  <CalendarIcon size={12} color="gray" />
                  <Text size="xs" c="dimmed">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Group>

              <Text size="xs" c="dimmed" lineClamp={2} mt={6}>
                {report.description}
              </Text>
            </Card>
          ))}
        </Stack>
      </ScrollArea>

      <ReportModal report={selected} opened={!!selected} onClose={() => setSelected(null)} />
    </Stack>
  );
}
