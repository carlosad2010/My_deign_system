import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Sin esto, el DOM de un test se filtra al siguiente y los `getBy*` empiezan a
// encontrar dos elementos donde debería haber uno.
afterEach(cleanup);
