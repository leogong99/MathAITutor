import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';
import '../lib/polyfills';

export const metadata = {
  title: 'Math Buddy - AI Math Tutor',
  description: 'Your Personal AI Math Tutor for interactive learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
