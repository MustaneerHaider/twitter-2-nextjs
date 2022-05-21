import React from 'react'
import {
  HomeIcon,
  BellIcon,
  MailIcon,
  HashtagIcon,
  DotsCircleHorizontalIcon,
  BookmarkIcon,
  UserIcon,
  CollectionIcon,
} from '@heroicons/react/outline'
import SidebarRow from './SidebarRow'
import { signIn, signOut, useSession } from 'next-auth/react'

function Sidebar() {
  const { data: session } = useSession()

  return (
    <div className="col-span-2 flex flex-col items-center px-4 md:items-start">
      <img
        className="m-3 h-10 w-10 cursor-pointer"
        src="https://links.papareact.com/drq"
      />
      <SidebarRow Icon={HomeIcon} title="Home" />
      <SidebarRow Icon={HashtagIcon} title="Explore" />
      <SidebarRow Icon={BellIcon} title="Notifications" />
      <SidebarRow Icon={MailIcon} title="Messages" />
      <SidebarRow Icon={BookmarkIcon} title="Bookmarks" />
      <SidebarRow Icon={CollectionIcon} title="Lists" />
      <SidebarRow
        onClick={session ? signOut : signIn}
        Icon={UserIcon}
        title={session ? 'Sign Out' : 'Sign In'}
      />
      <SidebarRow Icon={DotsCircleHorizontalIcon} title="More" />

      <button className="mt-5 rounded-full bg-twitter px-4 py-2 font-bold text-white transition-transform duration-200 ease-out active:scale-125">
        Tweet
      </button>
    </div>
  )
}

export default Sidebar
