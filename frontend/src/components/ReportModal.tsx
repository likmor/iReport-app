import {
  Modal,
  Text,
  Badge,
  Group,
  Stack,
  Divider,
  Image,
  SimpleGrid,
  Button,
} from "@mantine/core";
import type { Report } from "@/types/report";
import { CategoryIcon } from "@/utils/categoryIcons";
import { MapPinIcon } from "@phosphor-icons/react";
import { modals } from "@mantine/modals";
import { useDeleteReport } from "@/services/reportService";
import { useAuthStore } from "@/store/authStore";
const STATUS_COLORS: Record<string, string> = {
  New: "blue",
  InProgress: "yellow",
  Resolved: "green",
  Rejected: "red",
};

interface ReportModalProps {
  report: Report | null;
  opened: boolean;
  onClose: () => void;
}

export const ReportModal = ({ report, opened, onClose }: ReportModalProps) => {
    const {role} = useAuthStore();
  const { mutate: deleteReport, isPending } = useDeleteReport();
  if (!report) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          {report.title}
        </Text>
      }
      size="md"
      radius="md"
      centered
    >
      <Stack gap="md">
        <Group>
          <Badge color={STATUS_COLORS[report.status]} variant="outline" size="md">
            {report.status}
          </Badge>
        </Group>

        <Divider />

        <Group gap="xs">
          <CategoryIcon name={report.category.icon} size={16} />
          <Text size="sm" c="dimmed">
            Category
          </Text>
          <Text size="sm" fw={500}>
            {report.category.name}
          </Text>
        </Group>

        <Group gap="xs">
          <MapPinIcon size={16} color="gray" />
          <Text size="sm" c="dimmed">
            Location
          </Text>
          <Text size="sm" fw={500}>
            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
          </Text>
        </Group>

        <Divider />

        <div>
          <Text size="sm" c="dimmed" mb={4}>
            Description
          </Text>
          <Text size="sm">{report.description}</Text>
        </div>

        <div>
          <Text size="sm" c="dimmed" mb={8}>
            Photos
          </Text>
          <SimpleGrid cols={3}>
            <Image
              radius="sm"
              h={120}
              src={null}
              fallbackSrc="https://placehold.co/600x400?text=No+photo"
            />
          </SimpleGrid>
        </div>
        {(report.removable || role == "Admin") && (
          <Button
            variant="light"
            color="red"
            loading={isPending}
            onClick={() =>
              modals.openConfirmModal({
                centered: true,
                title: "Delete report",
                children: <Text size="sm">Are you sure you want to delete this report?</Text>,
                labels: { confirm: "Delete", cancel: "Cancel" },
                confirmProps: { color: "red" },

                onConfirm: async () => {
                  deleteReport(
                    { id: report.id },
                    {
                      onSuccess: () => {
                        onClose();
                      },
                    }
                  );
                },
              })
            }
          >
            Delete your report
          </Button>
        )}
      </Stack>
    </Modal>
  );
};
