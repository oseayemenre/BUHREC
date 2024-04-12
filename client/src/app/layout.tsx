import AuthContextProvider from "@/context/auth.context";
import PaymentProvider from "@/context/payment.context";

import { Nunito_Sans } from "next/font/google";

export const nunito_sans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={nunito_sans.className}>
        <PaymentProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </PaymentProvider>
      </body>
    </html>
  );
};

export default RootLayout;
