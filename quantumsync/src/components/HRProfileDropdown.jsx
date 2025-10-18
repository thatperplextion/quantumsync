import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const HRProfileDropdown = () => {
  const userProfile = {
    name: 'Sarah Johnson',
    role: 'HR Manager',
    email: 'sarah.j@company.com',
    avatar: null // We'll use a placeholder icon if no avatar is provided
  };

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center max-w-xs rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 p-2">
          <span className="sr-only">Open user menu</span>
          {userProfile.avatar ? (
            <img
              className="h-8 w-8 rounded-full"
              src={userProfile.avatar}
              alt=""
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-slate-300" />
          )}
          <div className="ml-3 text-left hidden sm:block">
            <p className="text-sm font-medium text-white">{userProfile.name}</p>
            <p className="text-xs text-slate-300">{userProfile.role}</p>
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm dark:text-white">{userProfile.name}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              {userProfile.email}
            </p>
          </div>

          <Menu.Item>
            {({ active }) => (
              <a
                href="#profile"
                className={classNames(
                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                  'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200'
                )}
              >
                Your Profile
              </a>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <a
                href="#settings"
                className={classNames(
                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                  'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200'
                )}
              >
                Settings
              </a>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <a
                href="#signout"
                className={classNames(
                  active ? 'bg-slate-100 dark:bg-slate-700' : '',
                  'block px-4 py-2 text-sm text-slate-700 dark:text-slate-200'
                )}
              >
                Sign out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default HRProfileDropdown;