import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Logger } from '@core/logger.service';
import enUS from '../../translations/en-US.json';
import heIL from '../../translations/he-IL.json';
import { RtlService } from '@app/@shared/services/rtl.service';
import { IPagedList } from '@app/@shared/models/paged-list.response';
import { LocaleResourceModel } from '@app/@shared/models/locale-resource-model';
import { MAX_INT } from '@app/@ideo/components/table/table.component';
import { LocaleResourcesService } from '@app/content/configuration/modules/localization/locale-resource/locale-resources.service';

const log = new Logger('I18nService');
const languageKey = 'language';

export enum languageEnum {
  'en-US' = 1,
  'he-IL' = 2,
}

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param s The string to extract for translation.
 * @return The same string.
 */
export function extract(s: string) {
  return s;
}

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  defaultLanguage!: string;
  supportedLanguages!: string[];

  private langChangeSubscription!: Subscription;

  public setTranslation(onAppLoad?: boolean) {
    const setLanguages = (res?: IPagedList<LocaleResourceModel>) => {
      const toJson = (items: LocaleResourceModel[], existing: any) =>
        !!items?.length
          ? items.reduce(
            (prev, curr, i) => ({
              ...prev,
              [curr.name]: curr.value,
            }),
            existing
          )
          : existing;
      // console.log(JSON.stringify(Object.keys(enUS))) //  for translate type
      const lang = localStorage.getItem(languageKey);
      switch (lang) {
        case languageEnum[languageEnum['en-US']]:
          this.translateService.setTranslation(
            lang,
            toJson(
              res?.data.filter((x) => x.languageId == languageEnum['en-US']),
              enUS
            )
          )
          break;
          case languageEnum[languageEnum['he-IL']]:
          this.translateService.setTranslation(
            lang,
            toJson(
              res?.data.filter((x) => x.languageId == languageEnum['he-IL']),
              heIL
            )
          );
          break;
        case 'none':
          this.translateService.setTranslation('', {});
        default:
          this.translateService.setTranslation(
            'en-US',
            toJson(
              res?.data.filter((x) => x.languageId == languageEnum['en-US']),
              enUS
            )
          );
          break;
      }
    };
    onAppLoad && setLanguages();
    this.localeResourcesService
      .getAll({ page: 1, pageSize: MAX_INT, sorts: ['Language.LanguageCulture' as any, 'name', 'value'] })
      .toPromise()
      .then((res) => {
        // set server translate
        // set serverTranslateType
        // console.log(JSON.stringify(res?.data?.filter(i => i.languageId == languageEnum['en-US'])?.map(i => i?.name)))
        setLanguages(res);
      });
  }

  constructor(private translateService: TranslateService, private localeResourcesService: LocaleResourcesService
    , private rtlService: RtlService) {
      this.setTranslation(true);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param defaultLanguage The default language to use.
   * @param supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = [...supportedLanguages, 'none'];
    this.language = '';

    // Warning: this subscription will always be alive for the app's lifetime
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem(languageKey, event.lang);
      this.setTranslation();
    });
  }

  /**
   * Cleans up language change subscription.
   */
  destroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = this.supportedLanguages.includes(language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find((supportedLanguage) => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    this.loadRtlLtrScripts('https://cdn.rtlcss.com/bootstrap/v4.5.3/css/bootstrap.min.css', 'bootstrap-rtl', !!this.isRTL(language));

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  public isRtlValue: boolean

  private isRTL(language: string = this.language) {
    let val = !!(language.includes('he-') || language.includes('ar-'));
    if(this.rtlService.isRtl != val){
      this.rtlService.rtlChanged.next(val);
    }
    this.isRtlValue = this.rtlService.isRtl = val;
    return this.isRtlValue;
  }

  /**
   * Gets the current language.
   * @return The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }

  public loadRtlLtrScripts(url: string, cssId: string, isRTL: boolean) {
    // if (!!isRTL && !document.getElementById(cssId)) {
    //   const head = document.getElementsByTagName('head')[0];
    //   const link = document.createElement('link');
    //   link.id = cssId;
    //   link.rel = 'stylesheet';
    //   link.type = 'text/css';
    //   link.href = url;
    //   link.media = 'all';
    //   head.appendChild(link);
    // }
    // !isRTL && document.getElementById(cssId)?.remove()
    document.documentElement.setAttribute('dir', !!isRTL ? 'rtl' : 'ltr');
  }
}
