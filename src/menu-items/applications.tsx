// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { KyberNetwork, Story, Messages2, Calendar1, Profile2User,PresentionChart, Bill, ShoppingBag } from 'iconsax-react';

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
  chart: PresentionChart,
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
      id: 'Diabetes Risk Prediction',
      title: <FormattedMessage id="Predict Diabetes Risk" />,
      type: 'item',
      url: '/apps/PredDiabetes',
      icon: icons.chart
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
          url: '/session'
        }
      ]
    }

  ]
};

export default applications;
