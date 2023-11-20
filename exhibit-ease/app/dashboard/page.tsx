'use client'

import { Tabs, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { CreditCard, Heart, Receipt } from 'tabler-icons-react';
import Favorites from './components/Favorites';
import { useRoleRedirect } from '../components/useRoleRedirect';


export default function Page() {
  const { data: session } = useSession();
  const iconStyle = { width: rem(16), height: rem(16) };
  useRoleRedirect();
  return <>
    {session && <>
      <h1>Dashboard</h1>
      <p>Hi, {session.user?.name || session.user?.email}!</p>
      <p>Your email is {session.user?.email}.</p>
      <div className='flex mt-4'>
        <Tabs variant="outline" orientation="vertical" defaultValue="favorites">
          <Tabs.List mr="lg">
            <Tabs.Tab value="favorites" leftSection={<Heart style={iconStyle} />}>
              Your Favorites
            </Tabs.Tab>
            <Tabs.Tab value="paymentInfo" leftSection={<CreditCard style={iconStyle} />}>
              Payment Info
            </Tabs.Tab>
            <Tabs.Tab value="orders" leftSection={<Receipt style={iconStyle} />}>
              Your Orders
            </Tabs.Tab>

          </Tabs.List>

          <Tabs.Panel value="favorites" pt="xs">
            <Favorites />
          </Tabs.Panel>

          <Tabs.Panel value="paymentInfo" pt="xs">
            Payment Info
          </Tabs.Panel>

          <Tabs.Panel value="orders" pt="xs">
            Orders
          </Tabs.Panel>
        </Tabs>
      </div>

    </>}
  </>;
}
