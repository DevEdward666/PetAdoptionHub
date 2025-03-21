import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";

// Ionic imports
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Setup Ionic
import { setupIonicReact } from '@ionic/react';
setupIonicReact({
  mode: 'md' // Use Material Design look and feel
});

createRoot(document.getElementById("root")!).render(<Root />);
