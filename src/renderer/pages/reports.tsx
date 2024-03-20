import { useEffect, useState } from 'react';
import { getSalesGroupByDate } from 'renderer/service/sales';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartData,
  Colors,
  ChartOptions,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, Col, Row } from 'react-bootstrap';
import { subDays } from 'date-fns';
import { toast } from 'react-toastify';
import { createDateLabels } from 'renderer/utils/helper';
import SalesBarChart from 'renderer/components/reports/salesBarChart';
import { getCategories } from 'renderer/service/categories';
import { getTags } from 'renderer/service/tags';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Colors,
  PointElement,
  LineElement
);

export const lineOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Last 7-day Sales',
    },
  },
};

const ReportingPage = () => {
  const [lineChartData, setLineChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [{ data: [], label: '' }],
  });

  const [lineStartDate] = useState<Date>(subDays(new Date(), 7));
  const [lineEndDate] = useState<Date>(new Date());
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const response1 = await getCategories();
      if (response1.isSuccess && response1.result) {
        setCategories(response1.result.map((v) => v.name));
      }
      const response2 = await getTags();
      if (response2.isSuccess && response2.result) {
        setTags(response2.result.map((v) => v.name));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { isSuccess, result, message } = await getSalesGroupByDate(
        lineStartDate,
        lineEndDate
      );

      if (isSuccess && result) {
        const labels = createDateLabels(lineStartDate, lineEndDate);
        setLineChartData({
          labels,
          datasets: [
            {
              label: 'Amount',
              data: labels.map((label) => result.get(label)?.total_price ?? 0),
            },
          ],
        });
      } else toast.error(message);
    })();
  }, [lineStartDate, lineEndDate]);

  return (
    <div className="pb-1">
      <h3>Reports</h3>
      <Row>
        <Col xl="6" xxl="4" className="mb-3">
          <SalesBarChart
            title="Top Selling Products"
            categories={categories}
            tags={tags}
            sort="desc"
          />
        </Col>
        <Col xl="6" xxl="4" className="mb-3">
          <SalesBarChart
            title="Least Selling Products"
            categories={categories}
            tags={tags}
            sort="asc"
          />
        </Col>
        <Col xl="12" xxl="4" className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div
                className="mt-3"
                style={{ position: 'relative', height: '350px' }}
              >
                <Line options={lineOptions} data={lineChartData} width={100} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportingPage;
