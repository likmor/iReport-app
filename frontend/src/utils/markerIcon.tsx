import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { CategoryIcon } from "@/utils/categoryIcons";
import { STATUS_COLORS } from "@/utils/statusIcons";
import type { ReportStatus } from "@/types/report";

export const createCategoryMarkerIcon = (iconName: string, status: ReportStatus) => {
  const color = STATUS_COLORS[status] ?? "gray";

  const iconHtml = renderToStaticMarkup(
    <CategoryIcon name={iconName} size={16} />
  );

  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: white;
        border: 2px solid var(--mantine-color-${color}-6);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <div style="transform: rotate(45deg); display: flex;">
          ${iconHtml}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};