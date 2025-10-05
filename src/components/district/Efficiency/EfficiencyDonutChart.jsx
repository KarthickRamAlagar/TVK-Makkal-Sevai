import { ResponsivePie } from "@nivo/pie";

const EfficiencyDonutChart = ({
  complaints,
  range = "today",
  statusFilter = "All",
  fallback = { resolved: 42, reAppealed: 8, rejected: 12, pending: 6 },
}) => {
  const isValidArray = Array.isArray(complaints);
  const filtered = isValidArray ? complaints : [];

  // ✅ Normalize status counts
  const resolved = filtered.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  const reAppealed = filtered.filter(
    (c) => c.status?.toLowerCase() === "reappealed"
  ).length;

  const rejected = filtered.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  const pending = filtered.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const useFallback = !isValidArray;

  // ✅ All status data as numbers
  const fullData = [
    {
      id: "Resolved",
      label: "Resolved",
      value: useFallback ? fallback.resolved : resolved,
      color: "#2E7D32",
    },
    {
      id: "ReAppealed",
      label: "ReAppealed",
      value: useFallback ? fallback.reAppealed : reAppealed,
      color: "#FB8C00",
    },
    {
      id: "Rejected",
      label: "Rejected",
      value: useFallback ? fallback.rejected : rejected,
      color: "#E53935",
    },
    {
      id: "Pending",
      label: "Pending",
      value: useFallback ? fallback.pending : pending,
      color: "#1E88E5",
    },
  ];

  // ✅ Filter by selected status
  const selectedSlice = fullData.find(
    (d) => d.id.toLowerCase() === statusFilter.toLowerCase()
  );

  const selectedStatusValue = selectedSlice?.value || 0;

  const allZero =
    statusFilter === "All"
      ? fullData.every((d) => d.value === 0)
      : selectedStatusValue === 0;

  // ✅ Chart data logic
  const chartData =
    statusFilter === "All"
      ? allZero
        ? [
            ...fullData.map((d) => ({
              ...d,
              value: 1,
              color: "#E0E0E0",
            })),
            {
              id: "Empty",
              label: "Empty",
              value: 0.0001,
              color: "#ffffff",
              hidden: true,
            },
          ]
        : fullData.map((d) => ({
            ...d,
            value: d.value === 0 ? 1 : d.value,
            color: d.value === 0 ? "#E0E0E0" : d.color,
          }))
      : selectedStatusValue > 0
        ? [
            {
              ...selectedSlice,
              value: selectedStatusValue,
              color: selectedSlice.color,
            },
          ]
        : [
            {
              ...selectedSlice,
              value: 100,
              color: "#E0E0E0",
            },
            {
              id: "Empty",
              label: "Empty",
              value: 0.0001,
              color: "#ffffff",
              hidden: true,
            },
          ];

  const centerLabel =
    statusFilter === "All"
      ? "All"
      : `${selectedSlice?.label || statusFilter} (${selectedStatusValue})`;

  return (
    <div className="w-full min-w-[240px] min-h-[280px] h-[300px] flex items-start justify-start">
      <ResponsivePie
        data={chartData}
        innerRadius={0.6}
        padAngle={1}
        cornerRadius={5}
        colors={(d) => (d.data.hidden ? "#ffffff" : d.data.color)}
        borderWidth={1}
        borderColor={(d) => (d.data.hidden ? "#ffffff" : "#fff")}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        motionConfig="gentle"
        layers={[
          "arcs",
          (props) => (
            <text
              x={props.centerX}
              y={props.centerY}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                fill: "#333",
              }}
            >
              {centerLabel}
            </text>
          ),
        ]}
        tooltip={({ datum }) => {
          const actual =
            fullData.find((d) => d.id.toLowerCase() === datum.id.toLowerCase())
              ?.value || 0;
          return (
            <div
              style={{
                padding: "6px 12px",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {datum.id}: {actual}
            </div>
          );
        }}
      />
    </div>
  );
};

export default EfficiencyDonutChart;
