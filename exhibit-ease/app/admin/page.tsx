'use client'
import { Tabs, rem } from '@mantine/core';

import { Album, Adjustments, ChartInfographic, BuildingBank } from 'tabler-icons-react';
import MuseumData from './components/MuseumData';
import EmployeeMgmt from './components/EmployeeMgmt';
import Promotion from './components/Promotion';
import { useRoleRedirect } from '../components/useRoleRedirect';

export default function Page() {
  const iconStyle = { width: rem(16), height: rem(16) };
  useRoleRedirect();
  return (
    <>
      <br />
      <h1>Welcome Manager! </h1>
      <br />
      <div className='flex'>
        <Tabs variant="outline" orientation="vertical" defaultValue="museum">
          <Tabs.List mr="lg">
            <Tabs.Tab value="museum" leftSection={<BuildingBank style={iconStyle} />}>
              Museum
            </Tabs.Tab>
            <Tabs.Tab value="stats" leftSection={<ChartInfographic style={iconStyle} />}>
              Stats
            </Tabs.Tab>
            <Tabs.Tab value="employee" leftSection={<Album style={iconStyle} />}>
              Employee Info
            </Tabs.Tab>
            <Tabs.Tab value="promotions" leftSection={<Adjustments style={iconStyle} />}>
              Add/Delete promotions
            </Tabs.Tab>

          </Tabs.List>

          <Tabs.Panel value="stats" pt="xs">
            Stats content
          </Tabs.Panel>

          <Tabs.Panel value="employee" pt="xs">
            <EmployeeMgmt />
          </Tabs.Panel>

          <Tabs.Panel value="promotions" pt="xs">
            <Promotion />
          </Tabs.Panel>
          <Tabs.Panel value="museum" pt="xs">
            <MuseumData />
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
