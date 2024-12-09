// THIRD - PARTY
import { FormattedMessage } from 'react-intl';

// ASSETS
import { Book1, I24Support, Security,CpuCharge, MessageProgramming, DollarSquare, Airplane } from 'iconsax-react';

// TYPE
import { NavItemType } from 'types/menu';

// ICONS
const icons = {
  page: Book1,
  authentication: Security,
  maintenance: MessageProgramming,
  plugins: CpuCharge,
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
      icon: icons.plugins,
      children: [
        {
          id: 'Health Data Analyst',
          title: (
            <>
              <FormattedMessage id="Health Data Analyst" /> 
            </>
          ),
          type: 'item',
          url: '/apps/Detection'
        },
        {
          id: 'Detection models',
          title: (
            <>
              <FormattedMessage id="Detection models" /> 
            </>
          ),
          type: 'item',
          url: '/apps/Detection'
        },
        {
          id: 'OCR Medical Document',
          title: (
            <>
              <FormattedMessage id="OCR Medical Document" /> 
            </>
          ),
          type: 'item',
          url: '/apps/MedOCR'
        },
        {
          id: 'Detection model2',
          title: (
            <>
              <FormattedMessage id="Train New Classifier Model" /> 
            </>
          ),
          type: 'item',
          url: '/apps/Transfer'
        },
        {
          id: 'Detection model3',
          title: (
            <>
              <FormattedMessage id="Visual Aid (beta)" /> 
            </>
          ),
          type: 'item',
          url: '/apps/ObjDetect'
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
