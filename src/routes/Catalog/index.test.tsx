import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/../dictionaries/en.json";
import Catalog from "./Catalog";
import { DatasetProps } from "@/typescript/interfaces/catalog.interface";
import { createContext } from "react";
import { Providers } from "@/store/provider";

const mockDatasets: DatasetProps[] = [
  {
    _id: "1",
    name: "Test Card",
    description: "This is a test description",
    visibility: true,
    totalDataItems: 5,
    image: "",
    dataschema: {
      _id: "string",
      name: "string",
      fields: [
        {
          name: "Field 1",
          description: "Field description",
          type: "text",
          placeholder: "Enter text",
          _id: "field1",
          required: true,
        },
      ],
      createdAt: "string",
      updatedAt: "string",
      category: "string",
    },
    createdAt: "",
    updatedAt: "",
    order: 1,
  },
];

describe("Catalog Component", () => {
  const CatalogContext = createContext({ datasets: mockDatasets, loading: false });

  test("renders loading spinner when loading is true", () => {
    render(
      <Providers>
        <CatalogContext.Provider value={{ datasets: mockDatasets, loading: false }}>
          <NextIntlClientProvider locale='en' messages={messages}>
            <Catalog />
          </NextIntlClientProvider>
        </CatalogContext.Provider>
      </Providers>,
    );

    const loadingElement = screen.getByTestId("loading-spinner");
    expect(loadingElement).toBeInTheDocument();
  });
});
