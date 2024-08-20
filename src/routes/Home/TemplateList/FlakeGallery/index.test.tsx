import { fireEvent, render, screen } from "@testing-library/react";
import FlakeGallery from ".";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

// Mock para react-medium-image-zoom
jest.mock("react-medium-image-zoom", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe("FlakeGallery Component", () => {
  // Defino los mensajes de traducción
  const messages = {
    dict: {
      home: {
        link_uitool: "Open in UiTool",
      },
    },
  };

  // Defino el objeto PWA mockeado
  const mockedApp = {
    _id: "1234asd",
    title: "Fake PWA",
    thumbnail: "https://example.com/image.png",
    skinx: {
      _id: "1235asd",
      title: "Fake SkinX title",
      description: "Fake SkinX description",
      category: "Fake SkinX category",
      thumbnail: "https://example.com/image.png",
    },
    hog_related: {
      _id: "12346asd",
      title: "Fake Hog Related",
      thumbnail: "https://example.com/image.png",
    },
    variables_in_use: [],
  };

  // Simulamos la variable de entorno
  process.env.NEXT_PUBLIC_UITOOL_URL = "https://fake-url.com";

  // Construimos la URL mockeada
  const api = `https://fake-url.com/skinx/${mockedApp.skinx._id}`;

  describe("renders correctly with correct translation and content", () => {
    test("should render the title of SkinX", () => {
      render(
        <NextIntlClientProvider locale='en' messages={messages}>
          <FlakeGallery app={mockedApp} />
        </NextIntlClientProvider>,
      );

      const title = screen.getByText(mockedApp.skinx.title);
      expect(title).toBeInTheDocument();
    });

    test("should render the link with the correct href", () => {
      render(
        <NextIntlClientProvider locale='en' messages={messages}>
          <FlakeGallery app={mockedApp} />
        </NextIntlClientProvider>,
      );

      const linkElement = screen.getByRole("link");
      expect(linkElement).toHaveAttribute("href", api);
    });

    test("should render the link with the correct target attribute", () => {
      render(
        <NextIntlClientProvider locale='en' messages={messages}>
          <FlakeGallery app={mockedApp} />
        </NextIntlClientProvider>,
      );

      const linkElement = screen.getByRole("link");
      expect(linkElement).toHaveAttribute("target", "_blank");
    });
  });

  describe("link behavior", () => {
    test("should simulate a click on the link", () => {
      render(
        <NextIntlClientProvider locale='en' messages={messages}>
          <FlakeGallery app={mockedApp} />
        </NextIntlClientProvider>,
      );

      const linkElement = screen.getByRole("link");
      fireEvent.click(linkElement);

      // Verificamos que el enlace está en el documento después del clic simulado
      expect(linkElement).toBeInTheDocument();
    });
  });
});
