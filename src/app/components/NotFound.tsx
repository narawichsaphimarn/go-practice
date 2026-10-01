import { Link } from "react-router-dom";
import { CLASS_PAGE, I18N_BACK, I18N_NOT_FOUND } from "../../shared/constants/content.ts";
import { ROUTE_HOME } from "../../shared/constants/preference.ts";
import { usePreferences } from "../../features/preferences/components/usePreferences.ts";

export function NotFound() {
  const { t } = usePreferences();
  return (
    <div className={CLASS_PAGE}>
      <Link to={ROUTE_HOME}>{t(I18N_BACK)}</Link>
      <p>{t(I18N_NOT_FOUND)}</p>
    </div>
  );
}
