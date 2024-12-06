// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { Book1, I24Support, Security, MessageProgramming, DollarSquare, Airplane } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ICONS
const icons = {
  page: Book1,
  authentication: Security,
  maintenance: MessageProgramming,
  pricing: DollarSquare,
  contactus: I24Support,
  landing: Airplane
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="Pro AI" />,
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'price',
      title: <FormattedMessage id="Medical AI" />,
      type: 'collapse',
      icon: icons.pricing,
      children: [
        {
          id: 'Detection models',
          title: (
            <>
              <FormattedMessage id="Detection models" /> 1
            </>
          ),
          type: 'item',
          url: '/price/price1'
        },
        {
          id: 'Detection model2',
          title: (
            <>
              <FormattedMessage id="Transfer Learning" /> 1
            </>
          ),
          type: 'item',
          url: '/price/price1'
        }
      ]
    },
    {
      id: 'landing',
      title: <FormattedMessage id="landing" />,
      type: 'item',
      icon: icons.landing,
      url: '/landing'
    }
  ]
};

export default pages;
