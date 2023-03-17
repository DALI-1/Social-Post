import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';
import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
import currencyData from 'cldr-core/supplemental/currencyData.json';
import weekData from 'cldr-core/supplemental/weekData.json';
import numbers from 'cldr-numbers-full/main/es/numbers.json';
import currencies from 'cldr-numbers-full/main/es/currencies.json';
import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
import dateFields from 'cldr-dates-full/main/es/dateFields.json';
import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';
import { process } from '@progress/kendo-data-query';

import esMessages from './es.json';
load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);

loadMessages(esMessages, 'es-ES');

const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
const intl = new IntlService('en');
/*orders.forEach(o => {
  o.orderDate = intl.parseDate(o.orderDate ? o.orderDate : '20/20/2020', DATE_FORMAT);
  o.shippedDate = o.shippedDate ? undefined : intl.parseDate(o.shippedDate ? o.orderDate.toString() : '20/20/2020', DATE_FORMAT);
});*/
const DetailComponent = props => {
  const dataItem = props.dataItem;
  return <div>
            <section style={{
      width: "200px",
      float: "left"
    }}>
              <p><strong>Street:</strong> {dataItem.shipAddress.street}</p>
              <p><strong>City:</strong> {dataItem.shipAddress.city}</p>
              <p><strong>Country:</strong> {dataItem.shipAddress.country}</p>
              <p><strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}</p>
            </section>
            <Grid style={{
      width: "500px"
    }} data={dataItem.details} />
          </div>;
};
export default function App(props)  {

    
  let Data=props.data


  const locales = [{
    language: 'en-US',
    locale: 'en'
  }, {
    language: 'es-ES',
    locale: 'es'
  }];
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    sort: [{
      field: 'followers_count',
      dir: 'asc'
    }],
    group: [{
      field: 'name'
    }]
  });
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [dataResult, setDataResult] = React.useState(process(Data, dataState));
  
  const dataStateChange = event => {
    setDataResult(process(Data, event.dataState));
    setDataState(event.dataState);
  };
  const expandChange = event => {
    const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({
      ...dataResult
    });
  };
  let _pdfExport;
  const exportExcel = () => {
    _export.save();
  };
  let _export;
  const exportPDF = () => {
    _pdfExport.save();
  };
  return( <LocalizationProvider language={currentLocale.language}>
            <IntlProvider locale={currentLocale.locale}>
              <div>

                {/*This Part here is what we gonna export to Excel it starts from here */}
                <ExcelExport data={Data} ref={exporter => {
          _export = exporter;
        }}>

          {/*Here is our Table */}
                  <Grid style={{
            height: '700px'
          }} sortable={true} filterable={true} groupable={true} reorderable={true} pageable={{
            buttonCount: 4,
            pageSizes: true
          }} data={dataResult} {...dataState} onDataStateChange={dataStateChange} detail={DetailComponent} expandField="expanded" onExpandChange={expandChange}>
                    <GridToolbar>
                      Locale:&nbsp;&nbsp;&nbsp;
                      <DropDownList value={currentLocale} textField="language" onChange={e => {
                setCurrentLocale(e.target.value);
              }} data={locales} />&nbsp;&nbsp;&nbsp;
                      <button title="Export to Excel" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={exportExcel}>
                        Export to Excel
                      </button>&nbsp;
                      <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" onClick={exportPDF}>Export to PDF</button>
                    </GridToolbar>
                    <GridColumn locked={true} field="id"  filterable={false} title="ID" />
                    <GridColumn field="name"  title="Page Name"   />
                    <GridColumn field="category" title="Page Category" />
                    <GridColumn field="followers_count" title="Page followers" />
                    <GridColumn field="fan_count" title="Page fans" />
                  </Grid>
                </ExcelExport>


                {/*This Part here is what we gonna export to Excel it Ends here */}

                {/*This Part here is what we gonna export to PDF it starts from here */}
                <GridPDFExport ref={element => {
          _pdfExport = element;
        }} margin="1cm">
                  {<Grid data={process(Data, {
            skip: dataState.skip,
            take: dataState.take
          })}>
                  <GridColumn locked={true} field="id"  filterable={false} title="ID" />
                    <GridColumn field="name"  title="Page Name"   />
                    <GridColumn field="category" title="Page Category" />
                    <GridColumn field="followers_count" title="Page followers" />
                    <GridColumn field="fan_count" title="Page fans" />
                  </Grid>}
                </GridPDFExport>
                {/*This Part here is what we gonna export to PDF it Ends here */}
              </div>
            </IntlProvider>
          </LocalizationProvider>);
};
