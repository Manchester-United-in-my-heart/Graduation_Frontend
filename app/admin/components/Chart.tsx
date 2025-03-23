import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

enum FigureType {
  Users = "users",
  Projects = "projects",
  Pages = "pages",
  PublishedBooks = "published_books",
}

interface ChartProps {
  data: any[];
  type: FigureType | string;
}

export default function Chart(props: ChartProps) {
  const { data, type } = props;
  return (
    <ResponsiveContainer width="100%" aspect={2.0}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey={type}
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
