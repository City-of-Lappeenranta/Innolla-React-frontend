import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import en from 'date-fns/locale/en-US';
import fi from 'date-fns/locale/fi';

import { GlobalContextProvider } from 'utils/state';

import { ErrorBoundary } from 'views/generic/error_boundary';
import { NotifyBoundary } from 'views/generic/notify_boundary';
import Index from 'views';

const locales = {
  en,
  fi,
};

class FILocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: Date) {
    return format(date, 'LLLL', { locale: this.locale });
  }

  getDatePickerHeaderText(date: Date) {
    return format(date, 'dd. MMMM', { locale: this.locale });
  }

  getHourText(date: Date) {
    return format(date, 'HH', { locale: this.locale });
  }

  getMinuteText(date: Date) {
    return format(date, 'mm', { locale: this.locale });
  }
}

function App() {
  return (
    <Sentry.ErrorBoundary>
      <GlobalContextProvider>
        <ErrorBoundary>
          <NotifyBoundary>
            <MuiPickersUtilsProvider
              utils={FILocalizedUtils}
              locale={locales.fi}
            >
              <Router>
                <Index />
              </Router>
            </MuiPickersUtilsProvider>
          </NotifyBoundary>
        </ErrorBoundary>
      </GlobalContextProvider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
