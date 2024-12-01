import format from 'date-fns/format';
import { Activity } from 'globalTypes/realm/activities.types';
import { useCallback, useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import ActivitiesFilter, {
  OnFilterParams,
} from 'renderer/components/activity/activitiesFilter';
import ActivityDetails from 'renderer/components/activity/activityDetails';
import { getActivities } from 'renderer/service/activities';

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState({
    transactBy: '',
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    productId: '',
  });

  useEffect(() => {
    (async () => {
      const response = await getActivities(filter);
      if (response.isSuccess) {
        setActivities(response.result ?? []);
      }
    })();
  }, [filter]);

  const onFilter = useCallback((filterValue: OnFilterParams) => {
    setFilter({
      transactBy: filterValue.user,
      startDate: filterValue.startDate,
      endDate: filterValue.endDate,
      productId: filterValue.productId ?? '',
    });
  }, []);

  return (
    <div>
      <h3>Activities</h3>
      <ActivitiesFilter onFilter={onFilter} />
      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Details</th>
                <th>Date</th>
                <th>Transact By</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.activity}</td>
                  <td>
                    <ActivityDetails activity={activity} />
                  </td>
                  <td>
                    {format(activity.date_created, 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>{activity.transact_by}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ActivitiesPage;
