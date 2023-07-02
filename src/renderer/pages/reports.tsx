import { useEffect, useState, ChangeEvent } from 'react';
import {
  getSalesGroupByDate,
  getSalesQtyByDateRange,
} from 'renderer/service/sales';
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
import { Bar, Line } from 'react-chartjs-2';
import { Card, Col, FormSelect, Row } from 'react-bootstrap';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns';
import { toast } from 'react-toastify';
import { createDateLabels } from 'renderer/utils/helper';

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

export const barOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Top Selling Products',
    },
  },
};

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
  const [barChartData, setBarChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [{ data: [], label: '' }],
  });
  const [lineChartData, setLineChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [{ data: [], label: '' }],
  });
  const [barStartDate, setBarStartDate] = useState<Date>(
    startOfWeek(new Date())
  );
  const [barEndDate, setBarEndDate] = useState<Date>(endOfWeek(new Date()));
  const [lineStartDate] = useState<Date>(subDays(new Date(), 7));
  const [lineEndDate] = useState<Date>(new Date());

  useEffect(() => {
    (async () => {
      const { isSuccess, result, message } = await getSalesQtyByDateRange(
        barStartDate,
        barEndDate
      );

      if (isSuccess && result) {
        setBarChartData({
          labels: result.map((r) => r.product_name),
          datasets: [
            {
              label: 'Qty',
              data: result.map((r) => r.quantity),
              backgroundColor: [
                'rgb(255, 51, 0)',
                'rgb(255, 153, 51)',
                'rgb(255, 204, 102)',
                'rgb(255, 255, 153)',
                'rgb(204, 255, 153)',
                'rgb(153, 255, 153)',
                'rgb(0, 204, 102)',
                'rgb(102, 255, 255)',
                'rgb(51, 204, 255)',
                'rgb(0, 102, 204)',
              ],
            },
          ],
        });
      } else toast.error(message);
    })();
  }, [barStartDate, barEndDate]);

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

  const handleChangeBarChart = (e: ChangeEvent<HTMLSelectElement>) => {
    const today = new Date();
    const val = e.target.value;
    if (val === 'This Week') {
      setBarStartDate(startOfWeek(today));
      setBarEndDate(endOfWeek(today));
    } else if (val === 'This Month') {
      setBarStartDate(startOfMonth(today));
      setBarEndDate(endOfMonth(today));
    } else if (val === 'This Year') {
      setBarStartDate(startOfYear(today));
      setBarEndDate(endOfYear(today));
    }
  };

  return (
    <div className="pb-1">
      <h3>Reports</h3>
      <Row>
        <Col xl="6" className="mb-3">
          <Card>
            <Card.Body>
              <FormSelect
                style={{ width: '200px' }}
                onChange={handleChangeBarChart}
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </FormSelect>
              <div style={{ position: 'relative', height: '350px' }}>
                <Bar options={barOptions} data={barChartData} width={100} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="6" className="mb-3">
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
