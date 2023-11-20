'use client';

import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Avatar as MantineAvatar,
  ActionIcon,
  Menu,
  Text,
  List,
  Card,
  Notification as MantineNotification,
} from '@mantine/core';
import Avatar from 'boring-avatars';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import classes from './Header.module.css';
import logo_no_background from '../images/logo_no_background.png';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Bell } from 'tabler-icons-react';
import { Notification } from '@prisma/client';


export default function Page() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const router = useRouter()
  const { data: session } = useSession();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Image
            width={85}
            height={85}
            src={logo_no_background}
            alt="Logo"
            className="filter invert"
          />


          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/" className={classes.link}>
              Home
            </a>

            <a href="/search" className={classes.link}>
              Search
            </a>
          </Group>

          {session ?
            <Group>
              {session.user?.role == 'C' ? <NotificationPanel /> : <></>}
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <MantineAvatar component={ActionIcon} size="lg"
                    className="hover:bg-sky-700 cursor-pointer">
                    <Avatar
                      name={session?.user?.name || ''}
                      variant="beam"
                      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                    />
                  </MantineAvatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => router.push(
                      session.user?.role === 'C' ? '/dashboard' :
                        session.user?.role === 'M' ? '/admin' : '/employee'
                    )}
                  >
                    Dashboard
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => signOut()}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
            : <Group visibleFrom="sm">
              <Button onClick={() => { signIn() }} variant="default">Log in</Button>
              <Button onClick={() => { router.push('/auth/register') }} variant="default" color='blue' >Sign up</Button>
            </Group>}

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="/" className={classes.link}>
            Home
          </a>

          <a href="/search" className={classes.link}>
            Search
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button onClick={() => { signIn() }} variant="default">Log in</Button>
            <Button onClick={() => { router.push('/auth/register') }} >Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

function NotificationPanel({ }: {}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/notifications?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          setHasUnread(data.some((notification: Notification) => !notification.read));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, read: true }),
      });

      const updatedNotifications = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      // Update local state to reflect the read status
      setNotifications(updatedNotifications);
      const allRead = updatedNotifications.every(n => n.read);
      setHasUnread(!allRead);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refetch every 60 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [session?.user?.id]);

  return (
    <>
      <ActionIcon onClick={open} variant="transparent" radius="xs" aria-label="Settings">
        <Bell size={25} strokeWidth={2} color={'black'} />
        {hasUnread && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>}
      </ActionIcon>
      <Drawer opened={opened} onClose={close} title="Notifications" size="md">
        <List spacing="sm" size="sm">
          {notifications.map(notification => (
            <List.Item
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}>
              <MantineNotification
                withBorder
                withCloseButton={false}
                color={notification.read ? "gray" : "blue"}
                className="cursor-pointer"
                styles={{ root: { backgroundColor: `${notification.read ? "transparent" : "#cff1fc"}` } }}>
                <Group wrap="nowrap" gap={0}>
                  {notification.message}
                  <ActionIcon onClick={() => { router.push(`/booking?museumId=${notification.museumId}&promoId=${notification.promoId}`); close(); }}>
                    <ArrowRight size={25} strokeWidth={2} color={'white'} />
                  </ActionIcon>
                </Group>
              </MantineNotification>
            </List.Item>
          ))}
        </List>
      </Drawer>
    </>
  );
}