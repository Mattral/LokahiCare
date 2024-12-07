import { FormattedMessage } from 'react-intl';
import { Home3, HomeTrendUp, Box1, Airplane, PasswordCheck,Profile2User, Story } from 'iconsax-react';
import { NavItemType } from 'types/menu';
//import { useGetMenu } from 'api/menu';

const icons = {
  dashboard: HomeTrendUp,
  components: Box1,
  customer: Profile2User,
  loading: Home3,
  validation: PasswordCheck,
  statistics: Story,
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
      title: <FormattedMessage id="User Verification" />,
      type: 'item',
      icon: icons.statistics,
      url: '/apps/UserVeri'
    },
    {
      id: 'Verify',
      title: <FormattedMessage id="Verify User" />,
      type: 'item',
      icon: icons.validation,
      url: '/apps/VOI'
    }
  ]
};
export default MenuFromAPI 

