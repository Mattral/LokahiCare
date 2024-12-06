// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { KyberNetwork, Story, Messages2, Calendar1, Profile2User, Bill, UserSquare, ShoppingBag } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ICONS
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  customer: Profile2User,
  invoice: Bill,
  statistics: Story,
  profile: UserSquare,
  ecommerce: ShoppingBag
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'Generate Legal Document',
      title: <FormattedMessage id="WhiteBoard Chat" />,
      type: 'item',
      url: '/forms/Whiteboard',
      icon: icons.statistics
    },

    
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'item',
      url: '/apps/profiles/user/personal',
      icon: icons.profile,
    },
    
    {
      id: 'Videocall',
      title: <FormattedMessage id="Consult with Doctor" />,
      type: 'collapse',
      icon: icons.ecommerce,
      children: [
        {
          id: 'Schedule',
          title: <FormattedMessage id="Schedule" />,
          type: 'item',
          url: '/apps/Videocall/Schedule'
        },
        {
          id: 'Recordings',
          title: <FormattedMessage id="Video Call" />,
          type: 'item',
          url: '/apps/Videocall/product-list'
        },
        {
          id: 'add-new-schedule',
          title: <FormattedMessage id="Join Video Call" />,
          type: 'item',
          url: '/apps/Videocall/add-new-schedule'
        },
      ]
    }

  ]
};

export default applications;
