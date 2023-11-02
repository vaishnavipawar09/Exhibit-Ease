'use client'
import { Tabs,rem } from '@mantine/core';

import { Album,Adjustments,ChartInfographic,BuildingBank } from 'tabler-icons-react';

export default function Page() {
  const iconStyle = { width: rem(16), height: rem(16) };
  return (
    <>
      <br/>
      <h1>Welcome Manager! </h1>
      <br/>
      <div className ='flex justify-center'>
      <Tabs defaultValue="stats">
      <Tabs.List>
        <Tabs.Tab value="stats" leftSection={<ChartInfographic style={iconStyle} />}>
          Stats
        </Tabs.Tab>
        <Tabs.Tab value="employee" leftSection={<Album style={iconStyle} />}>
          Employee Info
        </Tabs.Tab>
        <Tabs.Tab value="promotions" rightSection={<Adjustments style={iconStyle} />}>
          Add/Delete promotions
        </Tabs.Tab>
        <Tabs.Tab value="museum" rightSection={<BuildingBank style={iconStyle} />}>
          Museum
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="stats" pt="xs">
        Stats content
      </Tabs.Panel>

      <Tabs.Panel value="employee" pt="xs">
        Employee Info
      </Tabs.Panel>

      <Tabs.Panel value="promotions" pt="xs">
        Add/Delete promotions
      </Tabs.Panel>
      <Tabs.Panel value="museum" pt="xs">
        Museum tab content
      </Tabs.Panel>
    </Tabs>
    </div>
    </>
  );
}
