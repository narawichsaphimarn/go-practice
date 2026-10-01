import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CatalogPage } from "../features/catalog/components/CatalogPage.tsx";
import { LessonPage } from "../features/lesson/components/LessonPage.tsx";
import { PracticePage } from "../features/practice/components/PracticePage.tsx";
import { ROUTE_EXERCISES, ROUTE_LESSONS } from "../shared/constants/content.ts";
import { ROUTE_HOME } from "../shared/constants/preference.ts";
import { routerBasename } from "../shared/helpers/routes.ts";
import { NotFound } from "./components/NotFound.tsx";
import { TopBar } from "./components/TopBar.tsx";

export function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <TopBar />
      <main>
        <Routes>
          <Route path={ROUTE_HOME} element={<CatalogPage />} />
          <Route path={`${ROUTE_LESSONS}:lessonId`} element={<LessonPage />} />
          <Route path={`${ROUTE_LESSONS}:lessonId${ROUTE_EXERCISES}:exerciseId`} element={<PracticePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
