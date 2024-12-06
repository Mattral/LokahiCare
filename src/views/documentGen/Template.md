import { useEffect, useRef } from 'react';

// Declare the WebViewer type if it's not globally available
declare var WebViewer: any; // Assuming WebViewer is globally available, else you might need to import its type

const HomePage: React.FC = () => {
  const viewer = useRef<HTMLDivElement | null>(null);  // Ref for the viewer div

  useEffect(() => {
    // Lazy load the WebViewer library
    import('@pdftron/webviewer').then(() => {
      if (viewer.current) {
        WebViewer(
          {
            path: '/webviewer/lib',
            enableOfficeEditing: true,
            initialDoc: '/pdf/example.pdf',
            licenseKey: 'demo:1732014365003:7ef3c2a003000000002c9f3512bce4f73972cfbb7657c2c3a7c784a22f',  
            // replace with your own license key
          },
          viewer.current
        ).then((instance: any) => {
          const { docViewer } = instance;
          // Now you can call WebViewer APIs here
        });
      }
    });

  }, []);

  return (
    <div className='MyComponent'>
      <div className='webviewer' ref={viewer} style={{ height: '100vh' }}></div>
    </div>
  );
};

export default HomePage;
