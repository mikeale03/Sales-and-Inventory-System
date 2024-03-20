import { ChartData, ChartOptions } from 'chart.js';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { ChangeEvent, useEffect, useState } from 'react';
import { Card, Col, Form, FormSelect, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { getSalesByDateRange } from 'renderer/service/sales';
import CategorySelect from '../common/selects/categorySelect';
import TagsSelect from '../common/selects/tagsSelect';

type SortByProp = 'quantity' | 'total_price';

type Props = {
  title: string;
  categories: string[];
  tags: string[];
  sort: 'asc' | 'desc';
};

const SalesBarChart = ({ title, categories, tags, sort }: Props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortByProp>('quantity');
  const [barChartData, setBarChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [{ data: [], label: '' }],
  });

  const [barStartDate, setBarStartDate] = useState<Date>(
    startOfWeek(new Date())
  );
  const [barEndDate, setBarEndDate] = useState<Date>(endOfWeek(new Date()));

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const handleChangePeriod = (e: ChangeEvent<HTMLSelectElement>) => {
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

  useEffect(() => {
    (async () => {
      const { isSuccess, result, message } = await getSalesByDateRange(
        barStartDate,
        barEndDate,
        category,
        selectedTags,
        sortBy,
        sort,
        10
      );
      console.log(result);
      if (isSuccess && result) {
        setBarChartData({
          labels: result.map((r) => r.product_name),
          datasets: [
            {
              label: 'Qty',
              data: result.map((r) => r[sortBy]),
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
  }, [barStartDate, barEndDate, category, sort, sortBy, selectedTags]);

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col lg="4">
            <Form.Group>
              <Form.Label>Period</Form.Label>
              <FormSelect onChange={handleChangePeriod}>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </FormSelect>
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group>
              <Form.Label>By</Form.Label>
              <Form.Control
                as="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortByProp)}
              >
                <option value="quantity">Quantity</option>
                <option value="total_price">Amount</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg="4">
            <CategorySelect
              value={category}
              onSelect={setCategory}
              options={categories}
              defaltValue="All Categories"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TagsSelect
              value={selectedTags}
              onChange={setSelectedTags}
              options={tags}
              placeholder="All Tags"
              isCreatable
            />
          </Col>
        </Row>

        <div style={{ position: 'relative', height: '350px' }}>
          <Bar options={barOptions} data={barChartData} width={100} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesBarChart;
