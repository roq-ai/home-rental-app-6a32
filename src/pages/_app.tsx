import "@roq/nextjs/index.css";
import type { AppProps } from "next/app";
import { RoqProvider } from "providers";
import "react-datepicker/dist/react-datepicker.css";
import "styles/globals.css";
import { ThemeProvider } from "styles/provider/theme-provider";
import Script from "next/script";
import { FilterProvider } from "context/FilterContext";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      {/* start tracking-scripts */}
      {/* end tracking-scripts */}
      <RoqProvider>
        <FilterProvider>
          <Component {...pageProps} />
        </FilterProvider>
      </RoqProvider>
    </ThemeProvider>
  );
}
