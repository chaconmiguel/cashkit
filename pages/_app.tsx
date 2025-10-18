import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId) {
      ReactGA.initialize(gaId);
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ReactGA.send({ hitType: "pageview", page: url });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
