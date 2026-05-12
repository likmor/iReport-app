import { Modal, Text, Badge, Group, Stack, Divider, Image, SimpleGrid, CheckIcon } from "@mantine/core";

const STATUS_COLORS: Record<string, string> = {
  New: "blue",
  InProgress: "yellow",
  Resolved: "green",
  Rejected: "red",
};

interface Report {
  id: number;
  title: string;
  category: string;
  status: string;
  description: string;
  lat: number;
  lng: number;
}

interface ReportModalProps {
  report: Report | null;
  opened: boolean;
  onClose: () => void;
}

export const ReportModal = ({ report, opened, onClose }: ReportModalProps) => {
  if (!report) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700} size="lg">{report.title}</Text>}
      size="md"
      radius="md"
      zIndex={1001}
    >
      <Stack gap="md">
        <Group>
          <Badge color={STATUS_COLORS[report.status]} variant="outline" size="md">
            {report.status}
          </Badge>
        </Group>

        <Divider />

        <Group gap="xs">
          <CheckIcon size={16} color="gray" />
          <Text size="sm" c="dimmed">Category</Text>
          <Text size="sm" fw={500}>{report.category}</Text>
        </Group>

        <Group gap="xs">
          <CheckIcon size={16} color="gray" />
          <Text size="sm" c="dimmed">Location</Text>
          <Text size="sm" fw={500}>{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</Text>
        </Group>

        <Divider />

        <div>
          <Text size="sm" c="dimmed" mb={4}>Description</Text>
          <Text size="sm">{report.description}</Text>
        </div>

        <div>
          <Text size="sm" c="dimmed" mb={8}>Photos</Text>
          <SimpleGrid cols={3}>
            <Image radius="sm" h={80} src={null} fallbackSrc="https://placehold.co/120x80?text=No+photo" />
          </SimpleGrid>
        </div>
      </Stack>
    </Modal>
  );
};