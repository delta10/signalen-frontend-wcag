import { useTranslations } from "next-intl";
import {Select} from "@/components";
import {getAllAvailableLocales} from "@/utils/locale";

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <main>
      <h1>Signalen Frontend POC</h1>
      <p>{t('welcome')}</p>
      <Select values={getAllAvailableLocales()} />
    </main>
  )
}
