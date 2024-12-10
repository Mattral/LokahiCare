import { FormattedMessage } from 'react-intl';
import { Home3, HomeTrendUp, UserSquare, Box1, Airplane, PasswordCheck,Profile2User, Story } from 'iconsax-react';
import { NavItemType } from 'types/menu';
//import { useGetMenu } from 'api/menu';

const icons = {
  dashboard: HomeTrendUp,
  components: Box1,
  customer: Profile2User,
  loading: Home3,
  validation: PasswordCheck,
  statistics: Story,
  profile: UserSquare,
  landing: Airplane
};

const MenuFromAPI : NavItemType = {
  id: 'group-dashboard-loading',
  title: <FormattedMessage id="Pre-requisites" />,
  icon: icons.loading,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard/default',
      icon: icons.dashboard,
    },
    {
      id: 'CreateNew',
      title: <FormattedMessage id="Verify your Identity" />,
      type: 'item',
      icon: icons.statistics,
      url: '/apps/UserVeri'
    },
    {
      id: 'Verify',
      title: <FormattedMessage id="Manage Verification" />,
      type: 'item',
      icon: icons.validation,
      url: '/apps/VOI'
    },
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'item',
      url: '/apps/profiles/user/personal',
      icon: icons.profile,
    }
  ]
};
export default MenuFromAPI 

