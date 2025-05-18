import { MemoryRouter, Route, Routes } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ProductDetail from "../pages/ProductDetail";
import * as productApi from "../api/products";
import * as warehouseApi from "../api/warehouses";

const renderWithRouter = (productId = "fake-product-id") => {
  return render(
    <MemoryRouter initialEntries={[`/products/${productId}`]}>
      <Routes>
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProductDetail Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("cuando la página se carga correctamente", () => {
    it("debería mostrar los detalles del producto y las bodegas asociadas", async () => {
      const mockProduct = {
        name: "Producto Test",
        quantity: 100,
        unit_amount: 25.5,
      };

      const mockWarehouses = [
        {
          place: "Estante 1",
          warehouse: {
            name: "Bodega Central",
            location: "Medellín",
          },
        },
      ];

      vi.spyOn(productApi, "getProductById").mockResolvedValue(mockProduct);
      vi.spyOn(warehouseApi, "getWarehousesByProduct").mockResolvedValue(mockWarehouses);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/Producto Test - Producto/)).toBeDefined();
        expect(screen.getByText("Cantidad:")).toBeDefined();
        expect(screen.getByText("100")).toBeDefined();
        expect(screen.getByText("Precio unitario:")).toBeDefined();
        expect(screen.getByText("$25.50")).toBeDefined();
        expect(screen.getByText("Bodega Central")).toBeDefined();
        expect(screen.getByText("Medellín")).toBeDefined();
        expect(screen.getByText("Estante 1")).toBeDefined();
      });
    });
  });

  describe("cuando la página está cargando", () => {
    it("debería mostrar el loader", async () => {
      vi.spyOn(productApi, "getProductById").mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({}), 1000))
      );
      vi.spyOn(warehouseApi, "getWarehousesByProduct").mockResolvedValue([]);

      renderWithRouter();

      expect(screen.getByText(/Cargando/i)).toBeDefined();
    });
  });

  describe("cuando ocurre un error al cargar el producto", () => {
    it("debería mostrar mensaje de error del producto", async () => {
      vi.spyOn(productApi, "getProductById").mockRejectedValue(new Error("No se encontró el producto"));
      vi.spyOn(warehouseApi, "getWarehousesByProduct").mockResolvedValue([]);

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/¡Error!/i)).toBeDefined();
        expect(screen.getByText(/No se encontró el producto/i)).toBeDefined();
      });
    });
  });

  describe("cuando ocurre un error al cargar las bodegas", () => {
    it("debería mostrar mensaje de error de bodegas", async () => {
      vi.spyOn(productApi, "getProductById").mockResolvedValue({
        name: "Producto Test",
        quantity: 100,
        unit_amount: 25.5,
      });
      vi.spyOn(warehouseApi, "getWarehousesByProduct").mockRejectedValue(new Error("No se encontraron bodegas asociadas"));

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText(/¡Error!/i)).toBeDefined();
        expect(screen.getByText(/No se encontraron bodegas asociadas/i)).toBeDefined();
      });
    });
  });
});