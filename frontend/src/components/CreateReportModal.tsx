import { Modal, TextInput, Textarea, Select, Button, Stack, Text, FileInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateReport } from "../services/reportService";
import { useCategories } from "../services/categoryService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { createCategoryMarkerIcon } from "@/utils/markerIcon";
const KRAKOW: [number, number] = [50.0647, 19.945];

const LocationPicker = ({ onPick }: { onPick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => onPick(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

interface Props {
  opened: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

export const CreateReportModal = ({ opened, onClose, initialLat, initialLng }: Props) => {
  const { isLoggedIn } = useAuthStore();
  const { mutate: createReport, isPending } = useCreateReport();
  const { data: categories } = useCategories();
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const form = useForm({
    initialValues: { title: "", description: "", categoryId: "" },
    validate: {
      title: (v) => (v.trim().length < 3 ? "Title too short" : null),
      description: (v) => (v.trim().length < 10 ? "Description too short" : null),
      categoryId: (v) => (!v ? "Select a category" : null),
    },
  });
  const selectedCategory = categories?.find((c) => String(c.id) === form.values.categoryId);

  const handleSubmit = form.onSubmit((values) => {
    if (!position) return;
    createReport(
      {
        title: values.title,
        description: values.description,
        categoryId: parseInt(values.categoryId),
        latitude: position[0],
        longitude: position[1],
      },
      {
        onSuccess: () => {
          form.reset();
          setPosition(null);
          onClose();
        },
      }
    );
  });

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  if (!isLoggedIn)
    return (
      <Modal opened={opened} onClose={onClose} title="Submit a Report">
        <Text c="dimmed" ta="center" py="xl">
          You must be logged in to submit a report.
        </Text>
      </Modal>
    );

  return (
    <Modal opened={opened} onClose={onClose} title="Submit a Report" size="lg" radius="md" centered>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="Title" placeholder="Title" required {...form.getInputProps("title")} />

          <Textarea
            label="Description"
            placeholder="Description"
            minRows={3}
            required
            {...form.getInputProps("description")}
          />

          <Select
            label="Category"
            placeholder="Select category"
            data={categories?.map((c) => ({ value: String(c.id), label: c.name })) ?? []}
            required
            {...form.getInputProps("categoryId")}
          />
          <FileInput
            label="Upload images"
            placeholder="Select images"
            multiple
            accept="image/*"
            {...form.getInputProps("photos")}
          />
          <div>
            <Text size="sm" fw={500} mb={4}>
              Location{" "}
              <Text span size="xs" c="dimmed">
                — click map or
              </Text>{" "}
              <Text
                span
                size="xs"
                style={{ cursor: "pointer", color: "var(--mantine-color-lime-6)" }}
                onClick={handleGetLocation}
              >
                use my location
              </Text>
            </Text>
            {position && (
              <Text size="xs" c="dimmed" mb={4}>
                Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}
              </Text>
            )}
            <div style={{ height: 220, borderRadius: 8, overflow: "hidden" }}>
              <MapContainer center={KRAKOW} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onPick={(lat, lng) => setPosition([lat, lng])} />
                {position && (
                  <Marker
                    position={position}
                    icon={createCategoryMarkerIcon(selectedCategory?.icon ?? "", "New")}
                  />
                )}
              </MapContainer>
            </div>
            {!position && (
              <Text size="xs" c="red" mt={4}>
                Click the map to select a location
              </Text>
            )}
          </div>

          <Button type="submit" color="lime" c="dark" loading={isPending} disabled={!position}>
            Submit Report
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
